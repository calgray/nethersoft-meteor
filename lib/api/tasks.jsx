import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Messages = new Mongo.Collection('tasks');

//filter published messages after running `meteor remove autopublish`

//manually define db access methods after running `meteor remove insecure`


export default Messages;
