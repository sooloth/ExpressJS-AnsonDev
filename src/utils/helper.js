import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashedpassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds)
    console.log(salt)
    return bcrypt.hashSync(password, salt)
};

export const comparePassword = (plain,hashed) =>
    bcrypt.compareSync(plain,hashed);

