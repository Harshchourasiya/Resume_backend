
const OTP_MAIL_HTML_IMAGE_URL = "https://cdn.pixabay.com/photo/2017/10/31/00/23/portfolio-2903909_1280.png";

const OTP_MAIL_FROM = "Resume Builder <Harsh@gmail.com>";

const OTP_MAIL_SUBJECT = "One Time Password for Resume Builder is Here"

const GET_OTP_MAIL_HTML = (code) => {
    const str = `<div style="text-align:center">` +
        `<h1>` +
        `Resume Builder` +
        `</h1>` +
        `<p>` +
        `Id proident mollit ullamco culpa proident laboris est dolore.` +
        `</p>` +
        `<p style="font-size: 40px"> Your OTP Code is <b>${code}</b> </p>` +
        `<img src="${OTP_MAIL_HTML_IMAGE_URL}" width="100px" height="150px"/>`+
        `</div>`;
    return str;
}
module.exports = {
    OTP_MAIL_FROM,
    OTP_MAIL_SUBJECT,
    GET_OTP_MAIL_HTML
}