/**
 * ### Диаграмма
 * обработчики событий и модификаторы данных
 *
 * Created by Evgeniy Malyarov on 16.08.2018
 */

import {connect} from 'react-redux';
import withStyles from './styles';
import compose from 'recompose/compose';
import qs from 'qs';

// раз в час сбрасываем кеш
const cache = new Map();
function clearCache() {
  cache.clear();
}
setInterval(clearCache, 3600000);

const changes = [];

function mapStateToProps(state, props) {

  function key() {
    const {user} = props;
    return user && user.logged_in ? user.name : '';
  }

  function dbs() {
    const {superlogin, adapters: {pouch}, classes} = $p;
    let reports, doc;
    if(key()) {
      if(pouch.remote.reports && pouch.remote.reports.name.indexOf(superlogin.getSession().token) !== -1) {
        reports = pouch.remote.reports;
      }
      else {
        const rurl = superlogin.getDbUrl('reports');
        if(rurl) {
          const dbpath = pouch.dbpath('reports');
          const dbname = rurl.substr(rurl.lastIndexOf('/'));
          reports = pouch.remote.reports = new classes.PouchDB(dbpath.substr(0, dbpath.lastIndexOf('/')) + dbname, {skip_setup: true, adapter: 'http'});
        }
        else {
          reports = pouch.remote.remote;
        }
      }
      doc = pouch.local.doc;
    }
    else {
      reports = doc = pouch.remote.remote;
    }
    return {reports, doc};
  }

  function charts(reports, doc) {
    const tmp = cache.get(key());
    if(tmp) {
      return Promise.resolve(tmp);
    }

    // из reports достаём умолчания
    const keys = ['default'];
    if(key()) {
      keys.push(key());
    }
    return reports.allDocs({include_docs: true, keys})
      .then(({rows}) => {
        let settings, def;
        for(const row of rows) {
          if(row.doc && (row.id === keys[1] || !settings)){
            settings = row.doc;
          }
          if(row.doc && (row.id === keys[0])){
            def = row.doc;
          }
        }
        if(reports === doc) {
          return {settings, def};
        }
        return doc.allDocs({include_docs: true, keys})
          .then(({rows}) => {
            for(const row of rows) {
              if(row.doc && (row.id === keys[1] || !settings || settings._id === keys[0])){
                settings = row.doc;
              }
              if(row.doc && (row.id === keys[0])){
                def = row.doc;
              }
            }
            return {settings, def};
          });
      })
      .then((tmp) => {
        cache.set(key(), tmp);
        return tmp;
      });

  }

  function unsubscribe() {
    for(const ch of changes) {
      ch.cancel();
    }
    changes.length = 0;
  }

  function queryGrid() {
    const query = qs.parse(location.search.replace('?', ''));
    return query.grid;
  }

  return {

    diagrams() {
      unsubscribe();
      const {reports, doc} = dbs();
      return charts(reports, doc)
        .then(({settings}) => {
          const docs = settings && settings.charts ?
            Promise.all(settings.charts.map((chart) => {
              const path = chart.split('/');
              const db = path[0] === 'doc' ? doc : reports;
              return db.get(path[1]);
            })) : Promise.resolve([]);

          return docs.then((diagrams) => ({
            diagrams,
            grid: queryGrid() || (settings && settings.grid) || "1",
            settings,
          }));
        });
    },

    // получает объекты диаграмм из couchdb или из произвольного сервиса
    // либо, складывает готовый chart, если его передали в исходном массиве
    fetch(charts) {
      const {reports, doc} = dbs();
      const http = [], db = [];

      for(const chart of charts) {
        if(typeof chart === 'string' && chart.startsWith('http')) {
          http.push(fetch(chart).then((res) => res.json()));
        }
        else if(chart && typeof chart === 'string' && chart.indexOf('/') !== -1) {
          const path = chart.split('/');
          const pdb = path[0] === 'doc' ? doc : reports;
          db.push(pdb.get(path[1]));
        }
      }

      return Promise.all([Promise.all(http), Promise.all(db)])
        .then(([http, db]) => {
          const diagrams = [];
          for(const chart of charts) {
            if(chart && typeof chart === 'object') {
              diagrams.push(chart);
            }
            else if(typeof chart === 'string' && chart.startsWith('http')) {
              diagrams.push(http.shift());
            }
            else if(chart && typeof chart === 'string' && chart.indexOf('/') !== -1) {
              diagrams.push(db.shift());
            }
          }
          return diagrams;
        });
    },

    available() {
      const {reports, doc} = dbs();
      return charts(reports, doc)
        .then(({settings, def}) => {
          const grid = queryGrid() || (settings && settings.grid) || '1';
          const available = [];
          let row = 0;
          if(def && def.charts_available) {
            settings.charts.forEach((id) => {
              for (const ava of def.charts_available) {
                if(ava.id === id) {
                  ava.row = ++row;
                  ava.use = true;
                  available.push(ava);
                }
              }
            });
            for (const ava of def.charts_available) {
              if(available.indexOf(ava) === -1) {
                ava.row = ++row;
                ava.use = false;
                available.push(ava);
              }
            }
          }
          else {
            settings.charts.forEach((id) => {
              available.push({id, name: id, use: true, row: ++row});
            });
          }
          return {
            available,
            grid,
            settings,
          };
        });
    },

    changeCharts(available) {
      const {reports, doc} = dbs();
      return charts(reports, doc)
        .then(({settings}) => {
          settings.charts = available.filter(r => r.use).map(r => r.id);
          const grid = queryGrid();
          if(grid) {
            settings.grid = grid;
          }
        });
    },

    saveCharts(user) {
      const {reports, doc} = dbs();
      return charts(reports, doc)
        .then(({settings}) => {
          if(settings._id !== user.name){
            settings._id = user.name;
            delete settings._rev;
          }
          const grid = queryGrid();
          if(grid) {
            settings.grid = grid;
          }
          return doc.put(settings);
        })
        .then(clearCache);
    },

    subscribe(onChange) {
      const {reports, doc} = dbs();
      charts(reports, doc)
        .then(({settings: {charts}}) => {
          if(!charts) return;
          const map = new Map;
          for(const chart of charts) {
            const path = chart.split('/');
            const db = path[0] === 'doc' ? doc : reports;
            if(!map.has(db)){
              map.set(db, []);
            }
            map.get(db).push(path[1]);
          }
          for(const [db, keys] of map) {
            changes.push(db.changes({
              since: 'now',
              live: true,
              selector: {_id: {$in: keys}}
            })
              .on('change', onChange)
            );
          }
        });
    },

    queryGrid,

    unsubscribe
  };
}

// function mapDispatchToProps(dispatch, ownProps) {
//   return {
//     changeCharts(available) {
//       ownProps.np = 1;
//     }
//   };
// }

export default compose(
  withStyles,
  connect(mapStateToProps /*, mapDispatchToProps */),
);
