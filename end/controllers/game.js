const { Game, Manager, Event } = require('../models/index')

class GameController {
    static async read(req, res) {
        try {
            const games = await Game.findAll({
                include: Manager
            })

            res.render("games", { games })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
}

module.exports = GameController