import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const router = express.Router();
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', router);
exports.deleteUser = functions.https.onRequest(app);

router.route('/delete').post((req,res) => {
    const id = req.body.uid;
    admin.auth().deleteUser(id)
        .then(function() {
            res.json('ok')
        })
        .catch(function(error) {
            res.json(error)
        });
});
