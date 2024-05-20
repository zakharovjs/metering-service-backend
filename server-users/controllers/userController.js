const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const db = require('../db')
const jwt = require('jsonwebtoken')


function jwtTokens(id, email, role) {
    const user = {id, email, role};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '36h'});
    return ({accessToken, refreshToken});
}

class UserController{

    async signUp(req, res, next){
        try{
            const {email, password} = req.body
            if (!email || !password){
                return next(ApiError.badRequest('Некорректный email или пароль'))
            }

            const existEmail = await db.query(`SELECT id FROM users WHERE email = $1`, [email])
            if(existEmail.rows.length > 0){
                return next(ApiError.badRequest('Пользователь с таким email уже существует'))
            }

            const hashPassword = await bcrypt.hash(password, 5)
            const newUser = await db.query(
                `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`,
                [email, hashPassword]);
            res.json({users: newUser.rows[0]});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async signIn(req, res, next){
        try{
            const {email, password} = req.body
            const existUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email])
            if(existUser.rows.length===0){
                return next(ApiError.internal('Пользователь не найден!'))
            }

            //console.log(existUser.rows[0])
            let comparePass = bcrypt.compareSync(password, existUser.rows[0].password)
            if(!comparePass){
                return next(ApiError.internal('Указан неверный пароль!'))
            }
            let tokens = jwtTokens(existUser.rows[0].id, existUser.rows[0].email, existUser.rows[0].role)
            return res.json(tokens)
        }catch (error) {
            res.status(500).json({error: error.message});
        }

    }

    async getNewTokens(req, res){
        try {
            const {refreshToken} = req.body;
            //console.log(refreshToken);
            if(refreshToken === null) return res.status(401).json({error: 'Нет refresh токена'});
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                if(error) return res.status(403).json({error: error.message});
                //console.log(user)
                let tokens = jwtTokens(user.id, user.email, user.role);
                //res.cookie('refresh_token', tokens.refreshToken, {httpOnly: true});
                res.json(tokens);
            })
        } catch (error) {
            res.status(401).json({error:error.message});
        }
    }

    async updateUser(req, res){
        try {
            const email = req.user.email;
            const {username} = req.query;
            const update_name =  await db.query('UPDATE users SET username = $1 WHERE email =$2', [username, email]);
            const info =  await db.query('SELECT * FROM users WHERE email =$1', [email])
            res.json({message : info.rows})
        } catch (error) {
            res.status(500).json({error: error.message});
        }

    }
}

module.exports = new UserController()