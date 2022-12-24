
module.exports.extractToken = (data,tokenName) =>{
    let token = data.slice(data.indexOf(tokenName+"=")+tokenName.length + 1)
    token = token.split(";")[0]
    return token;
}
