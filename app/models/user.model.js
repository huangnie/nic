/**
 * Created by hn on 2015/3/3.
 */
mongoose.connect('mongodb://'+ db_config[1].host + '/' + db_config[1].dbname);
console.log(db_config[1]);
var Schema = mongoose.Schema ,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    name: String ,
    password: String
});

module.exports = mongoose.model('User', UserSchema);