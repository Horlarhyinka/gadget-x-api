module.exports.readCookie = (body,cookieName) =>{
    let cookie = body.split(";").filter(i =>{
       return i.slice(0,i.indexOf("=")) == cookieName
    })[0]
    if(!cookie) return;
    return cookie.slice(cookie.indexOf("=")+1)
}