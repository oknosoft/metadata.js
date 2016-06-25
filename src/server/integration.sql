-- Table: chlc
CREATE TABLE IF NOT EXISTS chlc
(
  zone integer NOT NULL,
  ref uuid NOT NULL,
  lc_changed bigint,
  class_name character varying(255),
  obj json,
  CONSTRAINT chlc_pk PRIMARY KEY (zone, ref)
)
WITH (OIDS=FALSE);
COMMENT ON TABLE chlc IS 'Здесь регистрируются изменённые объекты со стороны 1С. Клиентские приложения информируются об изменениях через вебсокет';

-- Table: chweb
CREATE TABLE IF NOT EXISTS chweb
(
  zone integer NOT NULL,
  ref uuid NOT NULL,
  lc_changed bigint,
  class_name character varying(255),
  obj json,
  CONSTRAINT chweb_pk PRIMARY KEY (zone, ref)
)
WITH (OIDS=FALSE);
COMMENT ON TABLE chweb IS 'Здесь регистрируются изменённые объекты со стороны web-приложений. 1С информируется об изменениях через http-сервис';

-- Table: chrefs
CREATE TABLE IF NOT EXISTS chrefs
(
  zone integer NOT NULL,
  ref uuid NOT NULL,
  lc_changed bigint,
  class_name character varying(255),
  CONSTRAINT chrefs_pk PRIMARY KEY (zone, ref)
)
WITH (OIDS=FALSE);
ALTER TABLE chrefs
  OWNER TO postgres;
COMMENT ON TABLE chrefs IS 'Здесь регистрируются ссылки изменённых в 1С объектов. Это аналог таблицы регистрации изменений плана обмена';

-- Table: meta
CREATE TABLE meta
(
  class_name character varying(255) NOT NULL,
  ref uuid, -- Ссылка справочника ИдентификаторыОбъектовМетаданных
  cache smallint, -- Кешировать объект на стороне браузера
  hide boolean, -- Не показывать объекты данного класса в автогенерируемом интерфейса
  lc_changed_base bigint, -- Базовый диапазон дат для упорядочивания начального образа
  irest_enabled boolean, -- К объекту разрешен доступ через http-сервис библиотеки интеграции
  reg_type smallint, -- Тип регистрации изменений
  meta json, -- Копия описания метаданных из 1С
  meta_patch json, -- Изменения-дополнения метаданных
  CONSTRAINT meta_pk PRIMARY KEY (class_name)
)
WITH (OIDS=FALSE);
COMMENT ON TABLE meta IS 'Список перечислений, справочников, документов, обработок и регистров, задействованных в веб-приложении';
COMMENT ON COLUMN meta.cache IS 'Кешировать объект на стороне браузера';
COMMENT ON COLUMN meta.hide IS 'Не показывать объекты данного класса в автогенерируемом интерфейса';
COMMENT ON COLUMN meta.lc_changed_base IS 'Базовый диапазон дат для упорядочивания начального образа';
COMMENT ON COLUMN meta.irest_enabled IS 'К объекту разрешен доступ через http-сервис библиотеки интеграции';
COMMENT ON COLUMN meta.reg_type IS 'Тип регистрации изменений';
COMMENT ON COLUMN meta.meta IS 'Копия описания метаданных из 1С';
COMMENT ON COLUMN meta.meta_patch IS 'Изменения-дополнения метаданных';
COMMENT ON COLUMN meta.ref IS 'Ссылка справочника ИдентификаторыОбъектовМетаданных';

-- Table: syns
CREATE TABLE syns
(
  name_1c character varying(255) NOT NULL,
  name_js character varying(255),
  CONSTRAINT syns_pk PRIMARY KEY (name_1c),
  CONSTRAINT syns_js_pk UNIQUE (name_js)
)
WITH (OIDS=FALSE);
COMMENT ON TABLE syns IS 'Синонимы метаданных';

