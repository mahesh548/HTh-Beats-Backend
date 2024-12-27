const Users = require("../../Database/Models/Users");
const utils = require("../../utils");

const addLanguage = async (req, res) => {
  const { lang, user } = req.body;
  try {
    if (!lang || !Array.isArray(lang))
      return res.status(400).json({ status: false, msg: "invalid input!" });

    const filteredLang = utils.filterLang(lang);
    if (filteredLang.length == 0)
      return res
        .statuus(400)
        .json({ status: false, msg: "atleast one language required!" });

    const u = await Users.updateOne(
      { id: user.id, email: user.email },
      { $set: { languages: filteredLang } }
    );

    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, msg: error.message });
  }
};
module.exports = addLanguage;
