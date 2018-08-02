/**
 * ### Формулы, как регламентные задания
 * https://github.com/oknosoft/windowbuilder/issues/422
 *
 * @module cron
 *
 * Created by Evgeniy Malyarov on 26.07.2018.
 */

const {CronJob} = require('cron');

function cron({utils}) {
  utils.cron = function (job) {
    if(job && job.cron && typeof job.exec === 'function') {
      if(job.env === 'browser' && typeof window === 'undefined'){
        return;
      }
      if(job.env === 'node' && typeof window !== 'undefined'){
        return;
      }
      new CronJob(job.cron, job.exec, job.onComplete, true, job.timeZone, job.context, job.runOnInit);
    }
  };
};

export default {

  /**
   * ### Модификатор конструктора MetaEngine
   * Вызывается в контексте экземпляра MetaEngine
   */
  constructor() {
    cron(this);
  }
};
