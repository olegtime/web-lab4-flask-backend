from flask import Flask, render_template, redirect, url_for, flash, request, jsonify
from config import Config
from models import db, User
from forms import RegistrationForm, LoginForm, ShootForm
from flask_login import LoginManager, login_user, logout_user, login_required, current_user

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'login'

attempts = []


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/', methods=['GET', 'POST'])
def index():
    return redirect(url_for('register'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    form = RegistrationForm()

    if request.form.get('login'):
        return redirect(url_for('login'))

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None:
            new_user = User(username=form.username.data, password=form.password.data)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user)
            flash('Your account has been created!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Username already exists. Please choose a different one.', 'danger')

    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))

    form = LoginForm()

    if request.form.get('register'):
        return redirect(url_for('register'))

    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.password == form.password.data:
            login_user(user)
            return redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check username and password', 'danger')

    return render_template('login.html', form=form)


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/clear', methods=['GET', 'POST'])
def clear():
    user = User.query.get(current_user.id)
    user.set_table([])
    db.session.add(user)
    db.session.commit()
    return redirect(url_for('home'))


@app.route('/home', methods=['GET', 'POST'])
@login_required
def home():
    form = ShootForm()
    user = User.query.get(current_user.id)

    if request.form.get('logout'):
        return redirect(url_for('logout'))

    if request.form.get('clear'):
        return redirect(url_for('clear'))

    if form.validate_on_submit():
        current_table = user.get_table()

        current_table.append([form.x.data, form.y.data, form.r.data, is_hit(form.x.data, form.y.data, form.r.data)])

        user.set_table(current_table)
        db.session.add(user)
        db.session.commit()

    return render_template('home.html', form=form, attempts=(user.get_table()))


@app.route('/shoot', methods=['POST'])
@login_required
def shoot():
    data = request.get_json()
    x = data.get('x')
    y = data.get('y')
    r = data.get('r')

    hit = is_hit(x, y, r)
    user = User.query.get(current_user.id)

    current_table = user.get_table()
    current_table.append([x, y, r, hit])
    user.set_table(current_table)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        'x': x,
        'y': y,
        'r': r,
        'hit': hit,
        'attempts': current_table
    })


def is_hit(x, y, r):
    x = float(x)
    y = float(y)
    r = float(r)
    return 0 <= x <= r and 0 <= y <= -0.5 * x + 0.5 * r or -r <= x <= 0 <= y <= 0.5 * r or x <= 0 and y <= 0 and x**2 + y**2 <= r**2


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
