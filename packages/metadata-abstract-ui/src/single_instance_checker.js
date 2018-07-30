/**
 *
 * ### Излучает событие second_instance, если открыт второй экземпляр приложения
 * по мотивам https://github.com/keeweb/keeweb
 *
 * @module log_manager
 *
 * Created 30.07.2018
 */

export default function checker() {
  const {utils, job_prm, md} = this;

  const checker = utils.single_instance_checker = {

    init() {
      if(typeof window === 'undefined') {
        return;
      }
      window.addEventListener('storage', this.storageChanged);
      const prefix = job_prm.local_storage_prefix
      this.LocalStorageKeyName = prefix + 'instanceCheck';
      this.LocalStorageResponseKeyName = prefix + 'instanceMaster';
      this.instanceKey = prefix + Date.now().toString();
      this.setKey(this.LocalStorageKeyName, this.instanceKey);
      this.emit = function (type) {
        md.emit(type);
      }
    },

    storageChanged(e) {
      if(!e.newValue) {
        return;
      }
      const {LocalStorageKeyName, LocalStorageResponseKeyName, instanceKey} = checker;
      if(e.key === LocalStorageKeyName && e.newValue !== instanceKey) {
        checker.setKey(LocalStorageResponseKeyName, instanceKey + Math.random().toString());
      }
      else if(e.key === LocalStorageResponseKeyName && e.newValue.indexOf(instanceKey) < 0) {
        window.removeEventListener('storage', checker.storageChanged);
        job_prm.second_instance = true;
        checker.emit('second_instance');
      }
    },

    setKey(key, value) {
      try {
        localStorage.setItem(key, value);
        setTimeout(() => {
          localStorage.removeItem(key);
        }, 100);
      } catch (e) {
      }
    }
  };
}

