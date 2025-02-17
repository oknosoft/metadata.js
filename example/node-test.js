
const MetaEngine = require('../core/dist');
// MetaEngine.plugin(...)
const $p = global.$p = new MetaEngine();
// параметры сеанса инициализируем сразу
$p.jobPrm.init(require('./app.settings'));
$p.md.init(require('./meta.json'));
$p.md.createManagers([]);

const raw = require('./rawData.json');
$p.cat.tags.load(raw.cat.tags);
const tag = $p.cat.tags.find({});
const tag2 = $p.cat.tags.create({name: 'Имя2'});
const tags = $p.cat.tags.findRows({name: 'Имя2'});
const all = $p.cat.tags.findRows({});
const doc = $p.doc.test.create({numberDoc: 7});


console.log(tag, doc.numberDoc);
