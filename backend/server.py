import tornado
import json

import tornado.web
import tornado.ioloop
import tornado.websocket

import router

global_dict = {}


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        messages = []
        self.render('index.html', messages=messages)


class WebSocket(tornado.websocket.WebSocketHandler):
    def check_origin(self, origin):
        return True

    def open(self):
        self.application.webSocketsPool.append(self)
        self.__id = ""
        global_dict[self] = ""

    def on_message(self, message):
        conn = self.application.conn
        db = self.application.db

        message_dict = json.loads(message)
        if 'actions' not in message_dict.keys():
            self.write_message("no actions in message")
            return
        response_actions = []
        for action in message_dict["actions"]:
            response_action = {'actionId': action['actionId'],
                               'type': action['type'],
                               }
            response = {}
            if action["type"] == "registration":
                response = router.register(action, db)
                conn.commit()
                if 'error' not in response.keys():
                    self.__id = action["provider"] + action['providerUserId']
                    global_dict[self] = action["provider"] + action['providerUserId']
            elif action['type'] == 'update_location':
                response = router.update_location(action, db)
                conn.commit()

            else:
                response['error'] = "sorry, no such action"
            response_action.update(response)
            response_actions.append(response_action)
        response = {'actions': response_actions}
        response = json.dumps(response)
        self.write_message(response)

    def on_close(self, message=None):
        conn = self.application.conn
        conn.commit()
        for key, value in enumerate(self.application.webSocketsPool):
            if value == self:
                del self.application.webSocketsPool[key]


class Application(tornado.web.Application):
    def __init__(self):
        self.webSocketsPool = []
        self.__id = ""

        settings = {
            'static_url_prefix': '/static/',
        }
        handlers = (
            (r'/', MainHandler),
            (r'/api?', WebSocket),
        )
        tornado.web.Application.__init__(self, handlers)

application = Application()

if __name__ == '__main__':
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
