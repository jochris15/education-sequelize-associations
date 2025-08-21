# Sequelize Associations

Pada kali ini , kita akan membahas bagaimana cara mengatur asosiasi antar table & model menggunakan Sequelize. 

## Default Foreign Key Format in Sequelize
Sebelum bahas asosiasi, kalian perlu tau bahwa dalam Sequelize, penulisan FK secara default itu menggunakan format `ModelId`. Misalnya, jika modelnya adalah `Game`, maka FK-nya akan menjadi `GameId`. Hal ini berpengaruh ketika kita mendifinisikan asosiasi, jika nama FKnya tidak default, kita perlu menyebutkan nama FK tersebut secara eksplisit.

## Foreign Key Constraint
Nah, sebelum kita membahas asosiasi dalam model, kita juga perlu mendefinisikan hubungan antar table , terutama pada saat membuat migrations.

Saat membuat suatu table & memiliki kolom FK, kita perlu memberikan aturan tambahan terhadap kolom FK tersebut :
```js
{
    type: Sequelize.INTEGER,
    // perlu ditambahkan referensi ke table apa
    references: {
        model: "Nama Refrensi Tablenya",
        key: "id"
    },
    onDelete: "cascade", // agar pada saat delete data di table yang terhubung, data di table ini juga ikut hilang
    onUpdate: "cascade" // agar pada saat update data di table yang terhubung, data di table ini juga ikut terupdate
}
```

## [Associations Types](https://sequelize.org/docs/v6/core-concepts/assocs/)
Sequelize mendukung beberapa jenis asosiasi antar model, yaitu:
- **One-to-One**: Satu model A berhubungan dengan satu model B.
- **One-to-Many**: Satu model A berhubungan dengan banyak model B.
- **Many-to-Many**: Banyak model A berhubungan dengan banyak model B melalui tabel perantara.

## One-to-One Association
Untuk mendefinisikan asosiasi `One-to-One` pada Sequelize, kita bisa menggunakan metode `hasOne` di model A dan `belongsTo` di model B (yang ada FK). 

Example
```js
// Asumsi FK ada di Manager (model B) dengan nama gameId (bukan format default)
class Game extends Model {
    static associate(models) {
      // define association here
      Game.hasOne(models.Manager, { foreignKey: 'gameId' });
    }
}

//  Model Manager (B)
class Manager extends Model {
    static associate(models) {
      // define association here
      Manager.belongsTo(models.Game, { foreignKey: 'gameId' });
    }
}
```

## One-to-Many Association
Untuk mendefinisikan asosiasi `One-to-Many`, kita menggunakan metode `hasMany` di model A dan `belongsTo` di model B (yang ada FK).

Example
```js
// Asumsi FK ada di Event (model B) dengan nama GameId (default format)
// karena FK-nya mengikuti format default, kita tidak perlu menyebutkan nama FK secara eksplisit
// Model Game (A)
class Game extends Model {
    static associate(models) {
      // define association here
      Game.hasMany(models.Event);
    }
}

//  Model Event (B)
class Event extends Model {
    static associate(models) {
      // define association here
      Event.belongsTo(models.Game);
    }
}
```

## Many-to-Many Association
Untuk mendefinisikan asosiasi `Many-to-Many`, kita perlu membuat tabel perantara (join table) yang akan menyimpan FK dari kedua model. Kita menggunakan metode `belongsToMany` di kedua model.

Example
```js
// Model Game (A)
class Game extends Model {
    static associate(models) {
      // define association here
      Game.belongsToMany(models.Player, { through: 'GamePlayers', foreignKey: 'GameId' });
    }
}   

// Model Player (B)
class Player extends Model {    
    static associate(models) {
      // define association here
      Player.belongsToMany(models.Game, { through: 'GamePlayers', foreignKey: 'PlayerId' });
    }
}

// terdapat model join table GamePlayers, tapi tidak perlu definisikan asosiasi di model tersebut
```

## Eager Loading
Nah, setelah kita mendefinisikan asosiasi di migrasi & di model, bagaimana cara mendapatkan data dari 2 table / lebih? 

Caranya adalah dengan menggunakan **Eager Loading**. Eager loading memungkinkan kita untuk mengambil data dari model yang berhubungan dalam satu query.
```js
// Versi Simple
const games = await Game.findAll({
  include: [Manager, Event]
});

// Versi Kompleks
const games = await Game.findAll({
  // jadikan array jika lebih dari satu, jadikan object jika butuh option tambahan
    include: [
        {
            model: Manager, // model yang ingin di-include
            attributes: ['name', 'phone'] // atribut yang ingin ditampilkan dari model Manager
        },
        {
            model: Event, // model yang ingin di-include
            attributes: ['name', 'eventDate'] // atribut yang ingin ditampilkan dari model Event
        }
    ]
});
```
## Demo
Pada demo kali ini hanya akan membahas asosiasi `One-to-Many` dan `Many-to-Many`.

### Setup 
Database : esport_app

```bash
npm init -y
npm i express pg sequelize sequelize-cli ejs
npm i -D nodemon
touch .gitignore
npx sequelize init
npx sequelize db:create
```

## Migration
**Table Games**

| Column name     | type      |
|-----------------|:---------:|
| name            | string    |
| gameImg         | string    |
| releaseDate     | date      |
| developer       | string    |
| genre           | string    |
```
npx sequelize model:create --name Game --attributes name:string,gameImg:string,releaseDate:date,developer:string,genre:string
```

**Table Manager**
| Column name     | type      |
|-----------------|:---------:|
| name            | string    |
| phone           | string    |
| GameId          | integer   | 
```
npx sequelize model:create --name Manager --attributes name:string,phone:string,GameId:integer
```

**Table Events**
Table Events

| Column name     | type      | constraint       |
|-----------------|:---------:|:----------------:|
| name            | string    | not null         |
| description     | text      | not null         |
| totalPrize      | string    | not null         |
| eventPoster     | string    | not null         |
| eventDate       | date      | not null         |
| eventType       | string    | default : Online |
| eventStatus     | string    | not null         |
```
npx sequelize model:create --name Event --attributes name:string,description:text,totalPrize:string,eventPoster:string,eventDate:date,eventType:string,eventStatus:string
```

## Custom Migration

Buat custom migration untuk mendefinisikan relasi antara table `Games` dan `Events`
```
npx sequelize migration:create --name add-GameId-events
```

**Notes**: jangan lupa edit modelnya dan menambahkan kolom `GameId` pada model `Event`.


## Seeder

Buatlah sebuah seed file untuk memasukan data ke tabel `Games`, `Managers` dan `Events`. Data berasal dari folder `data`.
```
npx sequelize seed:create --name seeder-games &&
npx sequelize seed:create --name seeder-managers &&
npx sequelize seed:create --name seeder-events
```

| Method | Route                | Deskripsi                                                                         |
| :----- | :----                | :---------------------------------------------------------------------            |
| GET    | /games               | Menampilkan data `Game` beserta dengan manager dan event-event yang dimilikinya   |  
| GET    | /managers            | Menampilkan data `Manager` beserta dengan gamenya                                 |
| GET    | /events              | Menampilkan data `Event` beserta dengan game dan managernya                       |
| GET    | /events/detail/:id   | Menampilkan data satuan `Event`                                                   |
| GET    | /events/add          | Menampilkan form untuk menambahkan data `Event`                                   |
| POST   | /events/add          | Menambahkan data `Event`                                                          |
| GET    | /events/edit/:id     | Menampilkan form untuk update data `Event`                                        |
| POST   | /events/edit/:id     | Mengupdate data `Event`                                                           |
| GET    | /events/delete/:id   | Menghapus data `Event` dari database                                              |
