from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, PasswordField, SubmitField, RadioField
from wtforms.validators import DataRequired, Length, EqualTo, ValidationError, InputRequired


def not_none(form, field):
    if field.data == 'None':
        raise ValidationError('Select X-value')


class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=150)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=2, max=150)])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


class ShootForm(FlaskForm):
    error_message = 'Y-field must be a number from -10 to 10. Use no more than one dot'
    x = StringField('X', validators=[DataRequired(), not_none])
    y = StringField('Y', validators=[InputRequired(message=error_message)])
    r = RadioField('R', validators=[DataRequired()], choices=[1, 2, 3, 4])
    submit = SubmitField('Submit')
