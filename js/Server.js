/**
 * Created by Оля on 22.12.2015.
 */
var express = require("express"),
    swagger = require("./swagger"),
    orm = require('./orm'),
    auth = require('./auth'),
    config = require('./config'),
    static_files = require('./static');

var app = express();

app.use(express.bodyParser());

auth.init(app);
orm.init(app);
swagger(app);
static_files(app);

app.listen(config.listen, config.ipaddr);

app.use(orm.express(config.db, {
    define: function (db, models) {

        db.define("users",
            {
                id       : Number,
                email    : String,
                password : String,
                twitter  : Number,
                facebook : Number,
                google   : Number,
                linkedin : String
            },
            {
                validations: {
                    email: [
                        orm.enforce.unique("Email already taken!"),
                        orm.enforce.unique({ ignoreCase: true }),
                        orm.enforce.notEmptyString()
                    ],
                    password: orm.enforce.notEmptyString()
                },
                id: "id",
                autoFetch: false
            }
        );
        var Conferences = db.define("conferences",
            {
                id          : Number,
                title       : String,
                description : String,
                datetime    : Date,
                place       : String,
                location    : String,
                site        : String,
                logo        : String,
                facebook    : String,
                twitter     : String,
                telephone   : String,
                cost        : String,
                file        : String
            },{
                id: "id",
                autoFetch: false
            }
        );
        var Decisions = db.define("decisions",
            {
                id            : Number,
                decision      : ['go', 'not go', 'favorite'],
                user          : Number,
                conference_id : Number
            },{
                id: "id",
                cache: false,
                autoFetch: false
            }
        );

        Decisions.hasOne('conference', Conferences, {reverse: 'decision'});
    }
}));