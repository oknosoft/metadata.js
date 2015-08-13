USE md;
CREATE TABLE IF NOT EXISTS refs (ref CHAR);
CREATE TABLE IF NOT EXISTS `enm_ТипыНоменклатуры` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR);
CREATE TABLE IF NOT EXISTS `doc_ЗаказПокупателя` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, posted BOOLEAN, date Date, number_doc CHAR, `ДатаИзменения` Date, `ДатаОтгрузки` Date, `Комментарий` CHAR, `Контрагент` CHAR, `delivery_area` CHAR, `shipping_address` CHAR, `coordinates` CHAR, `address_fields` CHAR, `СуммаДокумента` FLOAT, `СписокНоменклатуры` CHAR, `ts_Запасы` JSON);
CREATE TABLE IF NOT EXISTS `ireg_$log` (`date` Date, `sequence` INT, `class` CHAR, `note` CHAR, PRIMARY KEY (`date`, `sequence`));
CREATE TABLE IF NOT EXISTS `cat_delivery_areas` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, id CHAR, name CHAR, is_folder BOOLEAN, `region` CHAR, `city` CHAR, `latitude` FLOAT, `longitude` FLOAT, `ind` CHAR, `delivery_area` CHAR, `specify_area_by_geocoder` BOOLEAN);
CREATE TABLE IF NOT EXISTS `cat_Номенклатура` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, id CHAR, name CHAR, is_folder BOOLEAN, `Артикул` CHAR, `ТипНоменклатуры` CHAR, `Комментарий` CHAR, `СрокИсполненияЗаказа` INT, `parent` CHAR);
CREATE TABLE IF NOT EXISTS `cat_Контрагенты` (ref CHAR PRIMARY KEY NOT NULL, `deleted` BOOLEAN, lc_changed INT, id CHAR, name CHAR, is_folder BOOLEAN, `ИНН` CHAR, `Комментарий` CHAR, `parent` CHAR);
