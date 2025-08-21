const { Game, Manager } = require('../models/index')

class ManagerController {
    static async read(req, res) {
        try {
            const managers = await Manager.findAll({
                include: Game
            })

            res.render("managers", { managers })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    }
}

module.exports = ManagerController