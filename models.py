from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Text
from flask_login import UserMixin
import json

db = SQLAlchemy()


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password = db.Column(db.String(64), nullable=False)
    table = db.Column(Text)

    def get_table(self):
        return json.loads(self.table) if self.table else []

    def set_table(self, data):
        self.table = json.dumps(data)

    def __repr__(self):
        return '<User %r>' % self.username
