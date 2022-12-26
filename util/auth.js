
module.exports.extractToken = (data,tokenName) =>{
    if(!data || !tokenName)return;
    let token = data.slice(data.indexOf(tokenName+"=")+tokenName.length + 1)
    token = token.split(";")[0]
    return token;
}
