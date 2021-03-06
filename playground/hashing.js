const {SHA256: sha256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc!';

bcrypt.genSalt(10, (error, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashedPassword = '$2a$10$zL8rEfH4xfaC9U8g8o3/Jujdc8QWi/8WI74EhYJABup9uXo3PyX56';
bcrypt.compare(password, hashedPassword, (error, result) => {
  console.log(result);
});

// const data = {
//   id: 10
// };

// const token = jwt.sign(data, '123abc');
// console.log(token);

// const decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);

// const message = 'I am user number 3';
// const hash = sha256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// const data = {
//   id: 4
// };
// const token = {
//   data,
//   hash: sha256(JSON.stringify(data) + 'somesecret').toString()
// };

// // token.data.id = 5;
// // token.hash = sha256(JSON.stringify(token.data)).toString;

// const resultHash = sha256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.error('Data was changed. Do not trust');
// }