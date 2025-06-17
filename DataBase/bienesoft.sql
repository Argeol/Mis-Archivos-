CREATE DATABASE  IF NOT EXISTS `bienesoft` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bienesoft`;
-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: bienesoft
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activarfs`
--

DROP TABLE IF EXISTS `activarfs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activarfs` (
  `ID` int NOT NULL,
  `PermisFSActivo` tinyint NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activarfs`
--

LOCK TABLES `activarfs` WRITE;
/*!40000 ALTER TABLE `activarfs` DISABLE KEYS */;
INSERT INTO `activarfs` VALUES (1,0);
/*!40000 ALTER TABLE `activarfs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apprentice`
--

DROP TABLE IF EXISTS `apprentice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apprentice` (
  `id_apprentice` int unsigned NOT NULL,
  `first_name_apprentice` varchar(100) NOT NULL,
  `last_name_apprentice` varchar(100) NOT NULL,
  `birth_date_apprentice` date NOT NULL,
  `gender_apprentice` enum('masculino','femenino') NOT NULL,
  `email_apprentice` varchar(150) NOT NULL,
  `address_apprentice` varchar(200) NOT NULL,
  `address_type_apprentice` enum('Barrio','Vereda','Corregimiento','Comuna') NOT NULL,
  `phone_apprentice` varchar(20) NOT NULL,
  `status_apprentice` enum('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  `permission_count_apprentice` int unsigned DEFAULT '0',
  `id_municipality` int unsigned DEFAULT NULL,
  `File_Id` int NOT NULL,
  `Tip_apprentice` enum('interno','externo') DEFAULT NULL,
  `nom_responsible` varchar(45) NOT NULL,
  `ape_responsible` varchar(45) NOT NULL,
  `tel_responsible` varchar(12) DEFAULT NULL,
  `email_responsible` varchar(70) DEFAULT NULL,
  `Stratum_Apprentice` varchar(3) DEFAULT NULL,
  `tip_document` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`id_apprentice`),
  UNIQUE KEY `email_apprentice` (`email_apprentice`),
  KEY `fk_apprentice_municipality` (`id_municipality`),
  KEY `fk_apprentice_1_idx` (`File_Id`),
  CONSTRAINT `fk_apprentice_file` FOREIGN KEY (`File_Id`) REFERENCES `file` (`File_Id`),
  CONSTRAINT `fk_apprentice_municipality` FOREIGN KEY (`id_municipality`) REFERENCES `municipality` (`Id_municipality`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apprentice`
--

LOCK TABLES `apprentice` WRITE;
/*!40000 ALTER TABLE `apprentice` DISABLE KEYS */;
INSERT INTO `apprentice` VALUES (1076200170,'Fabian Dario ','Gomez Murcia ','2004-12-21','masculino','murcia21.gmz@gmail.com','San Jose ','Vereda','3102023477','Activo',0,280,111,'interno','Astrid ','Murcia Ortiz ','3208837582','danielcamilo02003@gmail.com','D4','TI'),(1076200180,'Zharick ','Naranjo ','2004-03-17','femenino','zhayanaquin@gmail.com','Las cruces','Barrio','312 4100908','Activo',0,428,123412,'externo','Niyiret ','Quintero ','3207634133','pedrita@gmail.com','2','TI'),(1105056493,'Cristian Camilo ','Tique Tique','2005-09-10','masculino','cmiloty1680@gmail.com','El Palmar','Vereda','3125396493','Inactivo',0,250,2824123,'interno','María Lidia ','Tique Yara','3115148714','marialidia@gmail.com','B1','CC'),(1105640150,'argeol','guio','2025-05-26','femenino','guioq@gmial.com','santuario','Corregimiento','3245896760','Activo',0,107,2824123,'externo','melancolico ','top','3202171414','Maritza.sarbarrios@gmail.com','B4','TI');
/*!40000 ALTER TABLE `apprentice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `area`
--

DROP TABLE IF EXISTS `area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `area` (
  `Area_Id` int NOT NULL,
  `Area_Name` varchar(45) NOT NULL,
  PRIMARY KEY (`Area_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area`
--

LOCK TABLES `area` WRITE;
/*!40000 ALTER TABLE `area` DISABLE KEYS */;
INSERT INTO `area` VALUES (1,'Agroindustria'),(2,'Pecuaria'),(3,'Agricola'),(4,'Gestion Ambiental'),(5,'Mecanizacion Agricola'),(6,'Gestion Administrativa');
/*!40000 ALTER TABLE `area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `Id_department` int unsigned NOT NULL AUTO_INCREMENT,
  `Name_department` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`Id_department`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (5,'ANTIOQUIA'),(8,'ATLÁNTICO'),(11,'BOGOTÁ, D.C.'),(13,'BOLÍVAR'),(15,'BOYACÁ'),(17,'CALDAS'),(18,'CAQUETÁ'),(19,'CAUCA'),(20,'CESAR'),(23,'CÓRDOBA'),(25,'CUNDINAMARCA'),(27,'CHOCÓ'),(41,'HUILA'),(44,'LA GUAJIRA'),(47,'MAGDALENA'),(50,'META'),(52,'NARIÑO'),(54,'NORTE DE SANTANDER'),(63,'QUINDIO'),(66,'RISARALDA'),(68,'SANTANDER'),(70,'SUCRE'),(73,'TOLIMA'),(76,'VALLE DEL CAUCA'),(81,'ARAUCA'),(85,'CASANARE'),(86,'PUTUMAYO'),(88,'ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA'),(91,'AMAZONAS'),(94,'GUAINÍA'),(95,'GUAVIARE'),(97,'VAUPÉS'),(99,'VICHADA');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `File_Id` int NOT NULL,
  `Apprentice_count` int NOT NULL,
  `Start_Date` date NOT NULL,
  `End_Date` date NOT NULL,
  `Program_Id` int NOT NULL,
  PRIMARY KEY (`File_Id`),
  KEY `fk_file_1_idx` (`Program_Id`),
  CONSTRAINT `fk_file_1` FOREIGN KEY (`Program_Id`) REFERENCES `program` (`Program_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,55,'2025-03-05','2025-03-05',1),(2,345,'2025-02-25','2025-04-05',1),(3,310,'2025-03-26','2025-03-26',1),(4,123,'2025-03-26','2025-03-26',1),(23,37,'2025-02-27','2025-03-28',1),(28,45,'2023-05-23','2025-03-14',1),(31,2,'2025-03-07','2025-03-22',1),(54,20,'2025-03-27','2025-03-27',1),(56,9,'2025-02-26','2025-03-25',1),(67,34,'2025-02-26','2025-03-28',1),(86,34,'2025-03-13','2025-03-29',1),(111,333,'2025-03-03','2025-04-04',1),(443,4,'2025-02-26','2025-03-21',1),(2312,45,'2025-06-09','2025-06-19',4),(2343,34,'2025-03-07','2025-04-05',1),(3224,12,'2025-03-05','2025-04-05',1),(123212,24,'2025-04-08','2025-05-11',1),(123412,33,'2025-04-30','2027-05-24',1),(1234532,34,'2025-07-20','2025-06-09',6),(2824123,15,'2025-03-05','2025-03-05',1);
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `municipality`
--

DROP TABLE IF EXISTS `municipality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `municipality` (
  `Id_municipality` int unsigned NOT NULL AUTO_INCREMENT,
  `municipality` varchar(255) NOT NULL DEFAULT '',
  `state` int unsigned NOT NULL,
  `Id_department` int unsigned NOT NULL,
  PRIMARY KEY (`Id_municipality`),
  KEY `fk_municipality_1_idx` (`Id_department`),
  CONSTRAINT `fk_municipality_1` FOREIGN KEY (`Id_department`) REFERENCES `department` (`Id_department`)
) ENGINE=InnoDB AUTO_INCREMENT=1101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `municipality`
--

LOCK TABLES `municipality` WRITE;
/*!40000 ALTER TABLE `municipality` DISABLE KEYS */;
INSERT INTO `municipality` VALUES (1,'Abriaquí',1,5),(2,'Acacías',1,50),(3,'Acandí',1,27),(4,'Acevedo',1,41),(5,'Achí',1,13),(6,'Agrado',1,41),(7,'Agua de Dios',1,25),(8,'Aguachica',1,20),(9,'Aguada',1,68),(10,'Aguadas',1,17),(11,'Aguazul',1,85),(12,'Agustín Codazzi',1,20),(13,'Aipe',1,41),(14,'Albania',1,18),(15,'Albania',1,44),(16,'Albania',1,68),(17,'Albán',1,25),(18,'Albán (San José)',1,52),(19,'Alcalá',1,76),(20,'Alejandria',1,5),(21,'Algarrobo',1,47),(22,'Algeciras',1,41),(23,'Almaguer',1,19),(24,'Almeida',1,15),(25,'Alpujarra',1,73),(26,'Altamira',1,41),(27,'Alto Baudó (Pie de Pato)',1,27),(28,'Altos del Rosario',1,13),(29,'Alvarado',1,73),(30,'Amagá',1,5),(31,'Amalfi',1,5),(32,'Ambalema',1,73),(33,'Anapoima',1,25),(34,'Ancuya',1,52),(35,'Andalucía',1,76),(36,'Andes',1,5),(37,'Angelópolis',1,5),(38,'Angostura',1,5),(39,'Anolaima',1,25),(40,'Anorí',1,5),(41,'Anserma',1,17),(42,'Ansermanuevo',1,76),(43,'Anzoátegui',1,73),(44,'Anzá',1,5),(45,'Apartadó',1,5),(46,'Apulo',1,25),(47,'Apía',1,66),(48,'Aquitania',1,15),(49,'Aracataca',1,47),(50,'Aranzazu',1,17),(51,'Aratoca',1,68),(52,'Arauca',1,81),(53,'Arauquita',1,81),(54,'Arbeláez',1,25),(55,'Arboleda (Berruecos)',1,52),(56,'Arboledas',1,54),(57,'Arboletes',1,5),(58,'Arcabuco',1,15),(59,'Arenal',1,13),(60,'Argelia',1,5),(61,'Argelia',1,19),(62,'Argelia',1,76),(63,'Ariguaní (El Difícil)',1,47),(64,'Arjona',1,13),(65,'Armenia',1,5),(66,'Armenia',1,63),(67,'Armero (Guayabal)',1,73),(68,'Arroyohondo',1,13),(69,'Astrea',1,20),(70,'Ataco',1,73),(71,'Atrato (Yuto)',1,27),(72,'Ayapel',1,23),(73,'Bagadó',1,27),(74,'Bahía Solano (Mútis)',1,27),(75,'Bajo Baudó (Pizarro)',1,27),(76,'Balboa',1,19),(77,'Balboa',1,66),(78,'Baranoa',1,8),(79,'Baraya',1,41),(80,'Barbacoas',1,52),(81,'Barbosa',1,5),(82,'Barbosa',1,68),(83,'Barichara',1,68),(84,'Barranca de Upía',1,50),(85,'Barrancabermeja',1,68),(86,'Barrancas',1,44),(87,'Barranco de Loba',1,13),(88,'Barranquilla',1,8),(89,'Becerríl',1,20),(90,'Belalcázar',1,17),(91,'Bello',1,5),(92,'Belmira',1,5),(93,'Beltrán',1,25),(94,'Belén',1,15),(95,'Belén',1,52),(96,'Belén de Bajirá',1,27),(97,'Belén de Umbría',1,66),(98,'Belén de los Andaquíes',1,18),(99,'Berbeo',1,15),(100,'Betania',1,5),(101,'Beteitiva',1,15),(102,'Betulia',1,5),(103,'Betulia',1,68),(104,'Bituima',1,25),(105,'Boavita',1,15),(106,'Bochalema',1,54),(107,'Bogotá D.C.',1,11),(108,'Bojacá',1,25),(109,'Bojayá (Bellavista)',1,27),(110,'Bolívar',1,5),(111,'Bolívar',1,19),(112,'Bolívar',1,68),(113,'Bolívar',1,76),(114,'Bosconia',1,20),(115,'Boyacá',1,15),(116,'Briceño',1,5),(117,'Briceño',1,15),(118,'Bucaramanga',1,68),(119,'Bucarasica',1,54),(120,'Buenaventura',1,76),(121,'Buenavista',1,15),(122,'Buenavista',1,23),(123,'Buenavista',1,63),(124,'Buenavista',1,70),(125,'Buenos Aires',1,19),(126,'Buesaco',1,52),(127,'Buga',1,76),(128,'Bugalagrande',1,76),(129,'Burítica',1,5),(130,'Busbanza',1,15),(131,'Cabrera',1,25),(132,'Cabrera',1,68),(133,'Cabuyaro',1,50),(134,'Cachipay',1,25),(135,'Caicedo',1,5),(136,'Caicedonia',1,76),(137,'Caimito',1,70),(138,'Cajamarca',1,73),(139,'Cajibío',1,19),(140,'Cajicá',1,25),(141,'Calamar',1,13),(142,'Calamar',1,95),(143,'Calarcá',1,63),(144,'Caldas',1,5),(145,'Caldas',1,15),(146,'Caldono',1,19),(147,'California',1,68),(148,'Calima (Darién)',1,76),(149,'Caloto',1,19),(150,'Calí',1,76),(151,'Campamento',1,5),(152,'Campo de la Cruz',1,8),(153,'Campoalegre',1,41),(154,'Campohermoso',1,15),(155,'Canalete',1,23),(156,'Candelaria',1,8),(157,'Candelaria',1,76),(158,'Cantagallo',1,13),(159,'Cantón de San Pablo',1,27),(160,'Caparrapí',1,25),(161,'Capitanejo',1,68),(162,'Caracolí',1,5),(163,'Caramanta',1,5),(164,'Carcasí',1,68),(165,'Carepa',1,5),(166,'Carmen de Apicalá',1,73),(167,'Carmen de Carupa',1,25),(168,'Carmen de Viboral',1,5),(169,'Carmen del Darién (CURBARADÓ)',1,27),(170,'Carolina',1,5),(171,'Cartagena',1,13),(172,'Cartagena del Chairá',1,18),(173,'Cartago',1,76),(174,'Carurú',1,97),(175,'Casabianca',1,73),(176,'Castilla la Nueva',1,50),(177,'Caucasia',1,5),(178,'Cañasgordas',1,5),(179,'Cepita',1,68),(180,'Cereté',1,23),(181,'Cerinza',1,15),(182,'Cerrito',1,68),(183,'Cerro San Antonio',1,47),(184,'Chachaguí',1,52),(185,'Chaguaní',1,25),(186,'Chalán',1,70),(187,'Chaparral',1,73),(188,'Charalá',1,68),(189,'Charta',1,68),(190,'Chigorodó',1,5),(191,'Chima',1,68),(192,'Chimichagua',1,20),(193,'Chimá',1,23),(194,'Chinavita',1,15),(195,'Chinchiná',1,17),(196,'Chinácota',1,54),(197,'Chinú',1,23),(198,'Chipaque',1,25),(199,'Chipatá',1,68),(200,'Chiquinquirá',1,15),(201,'Chiriguaná',1,20),(202,'Chiscas',1,15),(203,'Chita',1,15),(204,'Chitagá',1,54),(205,'Chitaraque',1,15),(206,'Chivatá',1,15),(207,'Chivolo',1,47),(208,'Choachí',1,25),(209,'Chocontá',1,25),(210,'Chámeza',1,85),(211,'Chía',1,25),(212,'Chíquiza',1,15),(213,'Chívor',1,15),(214,'Cicuco',1,13),(215,'Cimitarra',1,68),(216,'Circasia',1,63),(217,'Cisneros',1,5),(218,'Ciénaga',1,15),(219,'Ciénaga',1,47),(220,'Ciénaga de Oro',1,23),(221,'Clemencia',1,13),(222,'Cocorná',1,5),(223,'Coello',1,73),(224,'Cogua',1,25),(225,'Colombia',1,41),(226,'Colosó (Ricaurte)',1,70),(227,'Colón',1,86),(228,'Colón (Génova)',1,52),(229,'Concepción',1,5),(230,'Concepción',1,68),(231,'Concordia',1,5),(232,'Concordia',1,47),(233,'Condoto',1,27),(234,'Confines',1,68),(235,'Consaca',1,52),(236,'Contadero',1,52),(237,'Contratación',1,68),(238,'Convención',1,54),(239,'Copacabana',1,5),(240,'Coper',1,15),(241,'Cordobá',1,63),(242,'Corinto',1,19),(243,'Coromoro',1,68),(244,'Corozal',1,70),(245,'Corrales',1,15),(246,'Cota',1,25),(247,'Cotorra',1,23),(248,'Covarachía',1,15),(249,'Coveñas',1,70),(250,'Coyaima',1,73),(251,'Cravo Norte',1,81),(252,'Cuaspud (Carlosama)',1,52),(253,'Cubarral',1,50),(254,'Cubará',1,15),(255,'Cucaita',1,15),(256,'Cucunubá',1,25),(257,'Cucutilla',1,54),(258,'Cuitiva',1,15),(259,'Cumaral',1,50),(260,'Cumaribo',1,99),(261,'Cumbal',1,52),(262,'Cumbitara',1,52),(263,'Cunday',1,73),(264,'Curillo',1,18),(265,'Curití',1,68),(266,'Curumaní',1,20),(267,'Cáceres',1,5),(268,'Cáchira',1,54),(269,'Cácota',1,54),(270,'Cáqueza',1,25),(271,'Cértegui',1,27),(272,'Cómbita',1,15),(273,'Córdoba',1,13),(274,'Córdoba',1,52),(275,'Cúcuta',1,54),(276,'Dabeiba',1,5),(277,'Dagua',1,76),(278,'Dibulla',1,44),(279,'Distracción',1,44),(280,'Dolores',1,73),(281,'Don Matías',1,5),(282,'Dos Quebradas',1,66),(283,'Duitama',1,15),(284,'Durania',1,54),(285,'Ebéjico',1,5),(286,'El Bagre',1,5),(287,'El Banco',1,47),(288,'El Cairo',1,76),(289,'El Calvario',1,50),(290,'El Carmen',1,54),(291,'El Carmen',1,68),(292,'El Carmen de Atrato',1,27),(293,'El Carmen de Bolívar',1,13),(294,'El Castillo',1,50),(295,'El Cerrito',1,76),(296,'El Charco',1,52),(297,'El Cocuy',1,15),(298,'El Colegio',1,25),(299,'El Copey',1,20),(300,'El Doncello',1,18),(301,'El Dorado',1,50),(302,'El Dovio',1,76),(303,'El Espino',1,15),(304,'El Guacamayo',1,68),(305,'El Guamo',1,13),(306,'El Molino',1,44),(307,'El Paso',1,20),(308,'El Paujil',1,18),(309,'El Peñol',1,52),(310,'El Peñon',1,13),(311,'El Peñon',1,68),(312,'El Peñón',1,25),(313,'El Piñon',1,47),(314,'El Playón',1,68),(315,'El Retorno',1,95),(316,'El Retén',1,47),(317,'El Roble',1,70),(318,'El Rosal',1,25),(319,'El Rosario',1,52),(320,'El Tablón de Gómez',1,52),(321,'El Tambo',1,19),(322,'El Tambo',1,52),(323,'El Tarra',1,54),(324,'El Zulia',1,54),(325,'El Águila',1,76),(326,'Elías',1,41),(327,'Encino',1,68),(328,'Enciso',1,68),(329,'Entrerríos',1,5),(330,'Envigado',1,5),(331,'Espinal',1,73),(332,'Facatativá',1,25),(333,'Falan',1,73),(334,'Filadelfia',1,17),(335,'Filandia',1,63),(336,'Firavitoba',1,15),(337,'Flandes',1,73),(338,'Florencia',1,18),(339,'Florencia',1,19),(340,'Floresta',1,15),(341,'Florida',1,76),(342,'Floridablanca',1,68),(343,'Florián',1,68),(344,'Fonseca',1,44),(345,'Fortúl',1,81),(346,'Fosca',1,25),(347,'Francisco Pizarro',1,52),(348,'Fredonia',1,5),(349,'Fresno',1,73),(350,'Frontino',1,5),(351,'Fuente de Oro',1,50),(352,'Fundación',1,47),(353,'Funes',1,52),(354,'Funza',1,25),(355,'Fusagasugá',1,25),(356,'Fómeque',1,25),(357,'Fúquene',1,25),(358,'Gachalá',1,25),(359,'Gachancipá',1,25),(360,'Gachantivá',1,15),(361,'Gachetá',1,25),(362,'Galapa',1,8),(363,'Galeras (Nueva Granada)',1,70),(364,'Galán',1,68),(365,'Gama',1,25),(366,'Gamarra',1,20),(367,'Garagoa',1,15),(368,'Garzón',1,41),(369,'Gigante',1,41),(370,'Ginebra',1,76),(371,'Giraldo',1,5),(372,'Girardot',1,25),(373,'Girardota',1,5),(374,'Girón',1,68),(375,'Gonzalez',1,20),(376,'Gramalote',1,54),(377,'Granada',1,5),(378,'Granada',1,25),(379,'Granada',1,50),(380,'Guaca',1,68),(381,'Guacamayas',1,15),(382,'Guacarí',1,76),(383,'Guachavés',1,52),(384,'Guachené',1,19),(385,'Guachetá',1,25),(386,'Guachucal',1,52),(387,'Guadalupe',1,5),(388,'Guadalupe',1,41),(389,'Guadalupe',1,68),(390,'Guaduas',1,25),(391,'Guaitarilla',1,52),(392,'Gualmatán',1,52),(393,'Guamal',1,47),(394,'Guamal',1,50),(395,'Guamo',1,73),(396,'Guapota',1,68),(397,'Guapí',1,19),(398,'Guaranda',1,70),(399,'Guarne',1,5),(400,'Guasca',1,25),(401,'Guatapé',1,5),(402,'Guataquí',1,25),(403,'Guatavita',1,25),(404,'Guateque',1,15),(405,'Guavatá',1,68),(406,'Guayabal de Siquima',1,25),(407,'Guayabetal',1,25),(408,'Guayatá',1,15),(409,'Guepsa',1,68),(410,'Guicán',1,15),(411,'Gutiérrez',1,25),(412,'Guática',1,66),(413,'Gámbita',1,68),(414,'Gámeza',1,15),(415,'Génova',1,63),(416,'Gómez Plata',1,5),(417,'Hacarí',1,54),(418,'Hatillo de Loba',1,13),(419,'Hato',1,68),(420,'Hato Corozal',1,85),(421,'Hatonuevo',1,44),(422,'Heliconia',1,5),(423,'Herrán',1,54),(424,'Herveo',1,73),(425,'Hispania',1,5),(426,'Hobo',1,41),(427,'Honda',1,73),(428,'Ibagué',1,73),(429,'Icononzo',1,73),(430,'Iles',1,52),(431,'Imúes',1,52),(432,'Inzá',1,19),(433,'Inírida',1,94),(434,'Ipiales',1,52),(435,'Isnos',1,41),(436,'Istmina',1,27),(437,'Itagüí',1,5),(438,'Ituango',1,5),(439,'Izá',1,15),(440,'Jambaló',1,19),(441,'Jamundí',1,76),(442,'Jardín',1,5),(443,'Jenesano',1,15),(444,'Jericó',1,5),(445,'Jericó',1,15),(446,'Jerusalén',1,25),(447,'Jesús María',1,68),(448,'Jordán',1,68),(449,'Juan de Acosta',1,8),(450,'Junín',1,25),(451,'Juradó',1,27),(452,'La Apartada y La Frontera',1,23),(453,'La Argentina',1,41),(454,'La Belleza',1,68),(455,'La Calera',1,25),(456,'La Capilla',1,15),(457,'La Ceja',1,5),(458,'La Celia',1,66),(459,'La Cruz',1,52),(460,'La Cumbre',1,76),(461,'La Dorada',1,17),(462,'La Esperanza',1,54),(463,'La Estrella',1,5),(464,'La Florida',1,52),(465,'La Gloria',1,20),(466,'La Jagua de Ibirico',1,20),(467,'La Jagua del Pilar',1,44),(468,'La Llanada',1,52),(469,'La Macarena',1,50),(470,'La Merced',1,17),(471,'La Mesa',1,25),(472,'La Montañita',1,18),(473,'La Palma',1,25),(474,'La Paz',1,68),(475,'La Paz (Robles)',1,20),(476,'La Peña',1,25),(477,'La Pintada',1,5),(478,'La Plata',1,41),(479,'La Playa',1,54),(480,'La Primavera',1,99),(481,'La Salina',1,85),(482,'La Sierra',1,19),(483,'La Tebaida',1,63),(484,'La Tola',1,52),(485,'La Unión',1,5),(486,'La Unión',1,52),(487,'La Unión',1,70),(488,'La Unión',1,76),(489,'La Uvita',1,15),(490,'La Vega',1,19),(491,'La Vega',1,25),(492,'La Victoria',1,15),(493,'La Victoria',1,17),(494,'La Victoria',1,76),(495,'La Virginia',1,66),(496,'Labateca',1,54),(497,'Labranzagrande',1,15),(498,'Landázuri',1,68),(499,'Lebrija',1,68),(500,'Leiva',1,52),(501,'Lejanías',1,50),(502,'Lenguazaque',1,25),(503,'Leticia',1,91),(504,'Liborina',1,5),(505,'Linares',1,52),(506,'Lloró',1,27),(507,'Lorica',1,23),(508,'Los Córdobas',1,23),(509,'Los Palmitos',1,70),(510,'Los Patios',1,54),(511,'Los Santos',1,68),(512,'Lourdes',1,54),(513,'Luruaco',1,8),(514,'Lérida',1,73),(515,'Líbano',1,73),(516,'López (Micay)',1,19),(517,'Macanal',1,15),(518,'Macaravita',1,68),(519,'Maceo',1,5),(520,'Machetá',1,25),(521,'Madrid',1,25),(522,'Magangué',1,13),(523,'Magüi (Payán)',1,52),(524,'Mahates',1,13),(525,'Maicao',1,44),(526,'Majagual',1,70),(527,'Malambo',1,8),(528,'Mallama (Piedrancha)',1,52),(529,'Manatí',1,8),(530,'Manaure',1,44),(531,'Manaure Balcón del Cesar',1,20),(532,'Manizales',1,17),(533,'Manta',1,25),(534,'Manzanares',1,17),(535,'Maní',1,85),(536,'Mapiripan',1,50),(537,'Margarita',1,13),(538,'Marinilla',1,5),(539,'Maripí',1,15),(540,'Mariquita',1,73),(541,'Marmato',1,17),(542,'Marquetalia',1,17),(543,'Marsella',1,66),(544,'Marulanda',1,17),(545,'María la Baja',1,13),(546,'Matanza',1,68),(547,'Medellín',1,5),(548,'Medina',1,25),(549,'Medio Atrato',1,27),(550,'Medio Baudó',1,27),(551,'Medio San Juan (ANDAGOYA)',1,27),(552,'Melgar',1,73),(553,'Mercaderes',1,19),(554,'Mesetas',1,50),(555,'Milán',1,18),(556,'Miraflores',1,15),(557,'Miraflores',1,95),(558,'Miranda',1,19),(559,'Mistrató',1,66),(560,'Mitú',1,97),(561,'Mocoa',1,86),(562,'Mogotes',1,68),(563,'Molagavita',1,68),(564,'Momil',1,23),(565,'Mompós',1,13),(566,'Mongua',1,15),(567,'Monguí',1,15),(568,'Moniquirá',1,15),(569,'Montebello',1,5),(570,'Montecristo',1,13),(571,'Montelíbano',1,23),(572,'Montenegro',1,63),(573,'Monteria',1,23),(574,'Monterrey',1,85),(575,'Morales',1,13),(576,'Morales',1,19),(577,'Morelia',1,18),(578,'Morroa',1,70),(579,'Mosquera',1,25),(580,'Mosquera',1,52),(581,'Motavita',1,15),(582,'Moñitos',1,23),(583,'Murillo',1,73),(584,'Murindó',1,5),(585,'Mutatá',1,5),(586,'Mutiscua',1,54),(587,'Muzo',1,15),(588,'Málaga',1,68),(589,'Nariño',1,5),(590,'Nariño',1,25),(591,'Nariño',1,52),(592,'Natagaima',1,73),(593,'Nechí',1,5),(594,'Necoclí',1,5),(595,'Neira',1,17),(596,'Neiva',1,41),(597,'Nemocón',1,25),(598,'Nilo',1,25),(599,'Nimaima',1,25),(600,'Nobsa',1,15),(601,'Nocaima',1,25),(602,'Norcasia',1,17),(603,'Norosí',1,13),(604,'Novita',1,27),(605,'Nueva Granada',1,47),(606,'Nuevo Colón',1,15),(607,'Nunchía',1,85),(608,'Nuquí',1,27),(609,'Nátaga',1,41),(610,'Obando',1,76),(611,'Ocamonte',1,68),(612,'Ocaña',1,54),(613,'Oiba',1,68),(614,'Oicatá',1,15),(615,'Olaya',1,5),(616,'Olaya Herrera',1,52),(617,'Onzaga',1,68),(618,'Oporapa',1,41),(619,'Orito',1,86),(620,'Orocué',1,85),(621,'Ortega',1,73),(622,'Ospina',1,52),(623,'Otanche',1,15),(624,'Ovejas',1,70),(625,'Pachavita',1,15),(626,'Pacho',1,25),(627,'Padilla',1,19),(628,'Paicol',1,41),(629,'Pailitas',1,20),(630,'Paime',1,25),(631,'Paipa',1,15),(632,'Pajarito',1,15),(633,'Palermo',1,41),(634,'Palestina',1,17),(635,'Palestina',1,41),(636,'Palmar',1,68),(637,'Palmar de Varela',1,8),(638,'Palmas del Socorro',1,68),(639,'Palmira',1,76),(640,'Palmito',1,70),(641,'Palocabildo',1,73),(642,'Pamplona',1,54),(643,'Pamplonita',1,54),(644,'Pandi',1,25),(645,'Panqueba',1,15),(646,'Paratebueno',1,25),(647,'Pasca',1,25),(648,'Patía (El Bordo)',1,19),(649,'Pauna',1,15),(650,'Paya',1,15),(651,'Paz de Ariporo',1,85),(652,'Paz de Río',1,15),(653,'Pedraza',1,47),(654,'Pelaya',1,20),(655,'Pensilvania',1,17),(656,'Peque',1,5),(657,'Pereira',1,66),(658,'Pesca',1,15),(659,'Peñol',1,5),(660,'Piamonte',1,19),(661,'Pie de Cuesta',1,68),(662,'Piedras',1,73),(663,'Piendamó',1,19),(664,'Pijao',1,63),(665,'Pijiño',1,47),(666,'Pinchote',1,68),(667,'Pinillos',1,13),(668,'Piojo',1,8),(669,'Pisva',1,15),(670,'Pital',1,41),(671,'Pitalito',1,41),(672,'Pivijay',1,47),(673,'Planadas',1,73),(674,'Planeta Rica',1,23),(675,'Plato',1,47),(676,'Policarpa',1,52),(677,'Polonuevo',1,8),(678,'Ponedera',1,8),(679,'Popayán',1,19),(680,'Pore',1,85),(681,'Potosí',1,52),(682,'Pradera',1,76),(683,'Prado',1,73),(684,'Providencia',1,52),(685,'Providencia',1,88),(686,'Pueblo Bello',1,20),(687,'Pueblo Nuevo',1,23),(688,'Pueblo Rico',1,66),(689,'Pueblorrico',1,5),(690,'Puebloviejo',1,47),(691,'Puente Nacional',1,68),(692,'Puerres',1,52),(693,'Puerto Asís',1,86),(694,'Puerto Berrío',1,5),(695,'Puerto Boyacá',1,15),(696,'Puerto Caicedo',1,86),(697,'Puerto Carreño',1,99),(698,'Puerto Colombia',1,8),(699,'Puerto Concordia',1,50),(700,'Puerto Escondido',1,23),(701,'Puerto Gaitán',1,50),(702,'Puerto Guzmán',1,86),(703,'Puerto Leguízamo',1,86),(704,'Puerto Libertador',1,23),(705,'Puerto Lleras',1,50),(706,'Puerto López',1,50),(707,'Puerto Nare',1,5),(708,'Puerto Nariño',1,91),(709,'Puerto Parra',1,68),(710,'Puerto Rico',1,18),(711,'Puerto Rico',1,50),(712,'Puerto Rondón',1,81),(713,'Puerto Salgar',1,25),(714,'Puerto Santander',1,54),(715,'Puerto Tejada',1,19),(716,'Puerto Triunfo',1,5),(717,'Puerto Wilches',1,68),(718,'Pulí',1,25),(719,'Pupiales',1,52),(720,'Puracé (Coconuco)',1,19),(721,'Purificación',1,73),(722,'Purísima',1,23),(723,'Pácora',1,17),(724,'Páez',1,15),(725,'Páez (Belalcazar)',1,19),(726,'Páramo',1,68),(727,'Quebradanegra',1,25),(728,'Quetame',1,25),(729,'Quibdó',1,27),(730,'Quimbaya',1,63),(731,'Quinchía',1,66),(732,'Quipama',1,15),(733,'Quipile',1,25),(734,'Ragonvalia',1,54),(735,'Ramiriquí',1,15),(736,'Recetor',1,85),(737,'Regidor',1,13),(738,'Remedios',1,5),(739,'Remolino',1,47),(740,'Repelón',1,8),(741,'Restrepo',1,50),(742,'Restrepo',1,76),(743,'Retiro',1,5),(744,'Ricaurte',1,25),(745,'Ricaurte',1,52),(746,'Rio Negro',1,68),(747,'Rioblanco',1,73),(748,'Riofrío',1,76),(749,'Riohacha',1,44),(750,'Risaralda',1,17),(751,'Rivera',1,41),(752,'Roberto Payán (San José)',1,52),(753,'Roldanillo',1,76),(754,'Roncesvalles',1,73),(755,'Rondón',1,15),(756,'Rosas',1,19),(757,'Rovira',1,73),(758,'Ráquira',1,15),(759,'Río Iró',1,27),(760,'Río Quito',1,27),(761,'Río Sucio',1,17),(762,'Río Viejo',1,13),(763,'Río de oro',1,20),(764,'Ríonegro',1,5),(765,'Ríosucio',1,27),(766,'Sabana de Torres',1,68),(767,'Sabanagrande',1,8),(768,'Sabanalarga',1,5),(769,'Sabanalarga',1,8),(770,'Sabanalarga',1,85),(771,'Sabanas de San Angel (SAN ANGEL)',1,47),(772,'Sabaneta',1,5),(773,'Saboyá',1,15),(774,'Sahagún',1,23),(775,'Saladoblanco',1,41),(776,'Salamina',1,17),(777,'Salamina',1,47),(778,'Salazar',1,54),(779,'Saldaña',1,73),(780,'Salento',1,63),(781,'Salgar',1,5),(782,'Samacá',1,15),(783,'Samaniego',1,52),(784,'Samaná',1,17),(785,'Sampués',1,70),(786,'San Agustín',1,41),(787,'San Alberto',1,20),(788,'San Andrés',1,68),(789,'San Andrés Sotavento',1,23),(790,'San Andrés de Cuerquía',1,5),(791,'San Antero',1,23),(792,'San Antonio',1,73),(793,'San Antonio de Tequendama',1,25),(794,'San Benito',1,68),(795,'San Benito Abad',1,70),(796,'San Bernardo',1,25),(797,'San Bernardo',1,52),(798,'San Bernardo del Viento',1,23),(799,'San Calixto',1,54),(800,'San Carlos',1,5),(801,'San Carlos',1,23),(802,'San Carlos de Guaroa',1,50),(803,'San Cayetano',1,25),(804,'San Cayetano',1,54),(805,'San Cristobal',1,13),(806,'San Diego',1,20),(807,'San Eduardo',1,15),(808,'San Estanislao',1,13),(809,'San Fernando',1,13),(810,'San Francisco',1,5),(811,'San Francisco',1,25),(812,'San Francisco',1,86),(813,'San Gíl',1,68),(814,'San Jacinto',1,13),(815,'San Jacinto del Cauca',1,13),(816,'San Jerónimo',1,5),(817,'San Joaquín',1,68),(818,'San José',1,17),(819,'San José de Miranda',1,68),(820,'San José de Montaña',1,5),(821,'San José de Pare',1,15),(822,'San José de Uré',1,23),(823,'San José del Fragua',1,18),(824,'San José del Guaviare',1,95),(825,'San José del Palmar',1,27),(826,'San Juan de Arama',1,50),(827,'San Juan de Betulia',1,70),(828,'San Juan de Nepomuceno',1,13),(829,'San Juan de Pasto',1,52),(830,'San Juan de Río Seco',1,25),(831,'San Juan de Urabá',1,5),(832,'San Juan del Cesar',1,44),(833,'San Juanito',1,50),(834,'San Lorenzo',1,52),(835,'San Luis',1,73),(836,'San Luís',1,5),(837,'San Luís de Gaceno',1,15),(838,'San Luís de Palenque',1,85),(839,'San Marcos',1,70),(840,'San Martín',1,20),(841,'San Martín',1,50),(842,'San Martín de Loba',1,13),(843,'San Mateo',1,15),(844,'San Miguel',1,68),(845,'San Miguel',1,86),(846,'San Miguel de Sema',1,15),(847,'San Onofre',1,70),(848,'San Pablo',1,13),(849,'San Pablo',1,52),(850,'San Pablo de Borbur',1,15),(851,'San Pedro',1,5),(852,'San Pedro',1,70),(853,'San Pedro',1,76),(854,'San Pedro de Cartago',1,52),(855,'San Pedro de Urabá',1,5),(856,'San Pelayo',1,23),(857,'San Rafael',1,5),(858,'San Roque',1,5),(859,'San Sebastián',1,19),(860,'San Sebastián de Buenavista',1,47),(861,'San Vicente',1,5),(862,'San Vicente del Caguán',1,18),(863,'San Vicente del Chucurí',1,68),(864,'San Zenón',1,47),(865,'Sandoná',1,52),(866,'Santa Ana',1,47),(867,'Santa Bárbara',1,5),(868,'Santa Bárbara',1,68),(869,'Santa Bárbara (Iscuandé)',1,52),(870,'Santa Bárbara de Pinto',1,47),(871,'Santa Catalina',1,13),(872,'Santa Fé de Antioquia',1,5),(873,'Santa Genoveva de Docorodó',1,27),(874,'Santa Helena del Opón',1,68),(875,'Santa Isabel',1,73),(876,'Santa Lucía',1,8),(877,'Santa Marta',1,47),(878,'Santa María',1,15),(879,'Santa María',1,41),(880,'Santa Rosa',1,13),(881,'Santa Rosa',1,19),(882,'Santa Rosa de Cabal',1,66),(883,'Santa Rosa de Osos',1,5),(884,'Santa Rosa de Viterbo',1,15),(885,'Santa Rosa del Sur',1,13),(886,'Santa Rosalía',1,99),(887,'Santa Sofía',1,15),(888,'Santana',1,15),(889,'Santander de Quilichao',1,19),(890,'Santiago',1,54),(891,'Santiago',1,86),(892,'Santo Domingo',1,5),(893,'Santo Tomás',1,8),(894,'Santuario',1,5),(895,'Santuario',1,66),(896,'Sapuyes',1,52),(897,'Saravena',1,81),(898,'Sardinata',1,54),(899,'Sasaima',1,25),(900,'Sativanorte',1,15),(901,'Sativasur',1,15),(902,'Segovia',1,5),(903,'Sesquilé',1,25),(904,'Sevilla',1,76),(905,'Siachoque',1,15),(906,'Sibaté',1,25),(907,'Sibundoy',1,86),(908,'Silos',1,54),(909,'Silvania',1,25),(910,'Silvia',1,19),(911,'Simacota',1,68),(912,'Simijaca',1,25),(913,'Simití',1,13),(914,'Sincelejo',1,70),(915,'Sincé',1,70),(916,'Sipí',1,27),(917,'Sitionuevo',1,47),(918,'Soacha',1,25),(919,'Soatá',1,15),(920,'Socha',1,15),(921,'Socorro',1,68),(922,'Socotá',1,15),(923,'Sogamoso',1,15),(924,'Solano',1,18),(925,'Soledad',1,8),(926,'Solita',1,18),(927,'Somondoco',1,15),(928,'Sonsón',1,5),(929,'Sopetrán',1,5),(930,'Soplaviento',1,13),(931,'Sopó',1,25),(932,'Sora',1,15),(933,'Soracá',1,15),(934,'Sotaquirá',1,15),(935,'Sotara (Paispamba)',1,19),(936,'Sotomayor (Los Andes)',1,52),(937,'Suaita',1,68),(938,'Suan',1,8),(939,'Suaza',1,41),(940,'Subachoque',1,25),(941,'Sucre',1,19),(942,'Sucre',1,68),(943,'Sucre',1,70),(944,'Suesca',1,25),(945,'Supatá',1,25),(946,'Supía',1,17),(947,'Suratá',1,68),(948,'Susa',1,25),(949,'Susacón',1,15),(950,'Sutamarchán',1,15),(951,'Sutatausa',1,25),(952,'Sutatenza',1,15),(953,'Suárez',1,19),(954,'Suárez',1,73),(955,'Sácama',1,85),(956,'Sáchica',1,15),(957,'Tabio',1,25),(958,'Tadó',1,27),(959,'Talaigua Nuevo',1,13),(960,'Tamalameque',1,20),(961,'Tame',1,81),(962,'Taminango',1,52),(963,'Tangua',1,52),(964,'Taraira',1,97),(965,'Tarazá',1,5),(966,'Tarqui',1,41),(967,'Tarso',1,5),(968,'Tasco',1,15),(969,'Tauramena',1,85),(970,'Tausa',1,25),(971,'Tello',1,41),(972,'Tena',1,25),(973,'Tenerife',1,47),(974,'Tenjo',1,25),(975,'Tenza',1,15),(976,'Teorama',1,54),(977,'Teruel',1,41),(978,'Tesalia',1,41),(979,'Tibacuy',1,25),(980,'Tibaná',1,15),(981,'Tibasosa',1,15),(982,'Tibirita',1,25),(983,'Tibú',1,54),(984,'Tierralta',1,23),(985,'Timaná',1,41),(986,'Timbiquí',1,19),(987,'Timbío',1,19),(988,'Tinjacá',1,15),(989,'Tipacoque',1,15),(990,'Tiquisio (Puerto Rico)',1,13),(991,'Titiribí',1,5),(992,'Toca',1,15),(993,'Tocaima',1,25),(994,'Tocancipá',1,25),(995,'Toguí',1,15),(996,'Toledo',1,5),(997,'Toledo',1,54),(998,'Tolú',1,70),(999,'Tolú Viejo',1,70),(1000,'Tona',1,68),(1001,'Topagá',1,15),(1002,'Topaipí',1,25),(1003,'Toribío',1,19),(1004,'Toro',1,76),(1005,'Tota',1,15),(1006,'Totoró',1,19),(1007,'Trinidad',1,85),(1008,'Trujillo',1,76),(1009,'Tubará',1,8),(1010,'Tuchín',1,23),(1011,'Tulúa',1,76),(1012,'Tumaco',1,52),(1013,'Tunja',1,15),(1014,'Tunungua',1,15),(1015,'Turbaco',1,13),(1016,'Turbaná',1,13),(1017,'Turbo',1,5),(1018,'Turmequé',1,15),(1019,'Tuta',1,15),(1020,'Tutasá',1,15),(1021,'Támara',1,85),(1022,'Támesis',1,5),(1023,'Túquerres',1,52),(1024,'Ubalá',1,25),(1025,'Ubaque',1,25),(1026,'Ubaté',1,25),(1027,'Ulloa',1,76),(1028,'Une',1,25),(1029,'Unguía',1,27),(1030,'Unión Panamericana (ÁNIMAS)',1,27),(1031,'Uramita',1,5),(1032,'Uribe',1,50),(1033,'Uribia',1,44),(1034,'Urrao',1,5),(1035,'Urumita',1,44),(1036,'Usiacuri',1,8),(1037,'Valdivia',1,5),(1038,'Valencia',1,23),(1039,'Valle de San José',1,68),(1040,'Valle de San Juan',1,73),(1041,'Valle del Guamuez',1,86),(1042,'Valledupar',1,20),(1043,'Valparaiso',1,5),(1044,'Valparaiso',1,18),(1045,'Vegachí',1,5),(1046,'Venadillo',1,73),(1047,'Venecia',1,5),(1048,'Venecia (Ospina Pérez)',1,25),(1049,'Ventaquemada',1,15),(1050,'Vergara',1,25),(1051,'Versalles',1,76),(1052,'Vetas',1,68),(1053,'Viani',1,25),(1054,'Vigía del Fuerte',1,5),(1055,'Vijes',1,76),(1056,'Villa Caro',1,54),(1057,'Villa Rica',1,19),(1058,'Villa de Leiva',1,15),(1059,'Villa del Rosario',1,54),(1060,'Villagarzón',1,86),(1061,'Villagómez',1,25),(1062,'Villahermosa',1,73),(1063,'Villamaría',1,17),(1064,'Villanueva',1,13),(1065,'Villanueva',1,44),(1066,'Villanueva',1,68),(1067,'Villanueva',1,85),(1068,'Villapinzón',1,25),(1069,'Villarrica',1,73),(1070,'Villavicencio',1,50),(1071,'Villavieja',1,41),(1072,'Villeta',1,25),(1073,'Viotá',1,25),(1074,'Viracachá',1,15),(1075,'Vista Hermosa',1,50),(1076,'Viterbo',1,17),(1077,'Vélez',1,68),(1078,'Yacopí',1,25),(1079,'Yacuanquer',1,52),(1080,'Yaguará',1,41),(1081,'Yalí',1,5),(1082,'Yarumal',1,5),(1083,'Yolombó',1,5),(1084,'Yondó (Casabe)',1,5),(1085,'Yopal',1,85),(1086,'Yotoco',1,76),(1087,'Yumbo',1,76),(1088,'Zambrano',1,13),(1089,'Zapatoca',1,68),(1090,'Zapayán (PUNTA DE PIEDRAS)',1,47),(1091,'Zaragoza',1,5),(1092,'Zarzal',1,76),(1093,'Zetaquirá',1,15),(1094,'Zipacón',1,25),(1095,'Zipaquirá',1,25),(1096,'Zona Bananera (PRADO - SEVILLA)',1,47),(1097,'Ábrego',1,54),(1098,'Íquira',1,41),(1099,'Úmbita',1,15),(1100,'Útica',1,25);
/*!40000 ALTER TABLE `municipality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionApproval`
--

DROP TABLE IF EXISTS `permissionApproval`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionApproval` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PermissionId` int NOT NULL,
  `ResponsibleId` int NOT NULL,
  `ApprovalDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `ApprovalStatus` enum('Aprobado','Rechazado','Pendiente') NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (`Id`),
  KEY `permissionApproval_ibfk_1_idx` (`PermissionId`),
  KEY `fk_permissionApproval_1_idx` (`ResponsibleId`),
  CONSTRAINT `fk_permissionApproval_1` FOREIGN KEY (`ResponsibleId`) REFERENCES `responsible` (`Responsible_Id`),
  CONSTRAINT `permissionApproval_ibfk_1` FOREIGN KEY (`PermissionId`) REFERENCES `permissionGN` (`PermissionId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionApproval`
--

LOCK TABLES `permissionApproval` WRITE;
/*!40000 ALTER TABLE `permissionApproval` DISABLE KEYS */;
INSERT INTO `permissionApproval` VALUES (65,48,13991739,'2025-05-23 22:12:59','Aprobado'),(66,48,28948910,'2025-05-23 22:13:28','Aprobado'),(67,48,987654,'2025-05-23 22:14:03','Aprobado'),(68,48,987624312,'2025-05-23 22:16:15','Aprobado'),(69,49,13991739,NULL,'Pendiente'),(70,49,28948910,'2025-06-03 13:48:45','Rechazado'),(71,49,987654,NULL,'Pendiente'),(72,49,987624312,'2025-05-27 11:12:40','Rechazado'),(73,50,110625312,NULL,'Pendiente'),(74,50,34231211,NULL,'Pendiente'),(75,50,987654,NULL,'Pendiente'),(76,50,12435421,NULL,'Pendiente'),(77,50,726253,NULL,'Pendiente'),(78,50,987624312,NULL,'Pendiente'),(79,50,13991739,'2025-06-06 08:58:42','Rechazado'),(80,50,1076200180,NULL,'Pendiente'),(81,51,13991739,'2025-05-27 11:49:59','Aprobado'),(82,51,28948910,'2025-05-27 11:51:03','Aprobado'),(83,51,987654,'2025-05-27 11:52:06','Aprobado'),(84,51,987624312,'2025-05-27 11:53:35','Aprobado'),(90,54,13991739,'2025-06-03 14:02:03','Rechazado'),(91,54,28948910,NULL,'Pendiente'),(92,54,231223,NULL,'Pendiente'),(93,54,726253,NULL,'Pendiente'),(94,55,13991739,NULL,'Pendiente'),(95,55,28948910,'2025-06-03 14:49:43','Rechazado'),(96,55,231223,NULL,'Pendiente'),(97,55,726253,NULL,'Pendiente'),(105,58,13991739,'2025-06-06 08:58:45','Aprobado'),(106,58,28948910,'2025-06-06 08:59:49','Aprobado'),(107,58,987654,'2025-06-06 09:00:19','Aprobado'),(114,61,13991739,'2025-06-09 12:38:25','Aprobado'),(115,61,28948910,'2025-06-09 12:39:45','Aprobado'),(116,61,987654,'2025-06-09 12:40:13','Aprobado'),(117,62,13991739,'2025-06-09 12:43:58','Aprobado'),(118,62,28948910,'2025-06-09 12:44:14','Aprobado'),(119,62,987654,'2025-06-09 12:44:39','Aprobado');
/*!40000 ALTER TABLE `permissionApproval` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionFS`
--

DROP TABLE IF EXISTS `permissionFS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionFS` (
  `PermissionFS_Id` int NOT NULL AUTO_INCREMENT,
  `Apprentice_Id` int unsigned NOT NULL,
  `Destino` varchar(45) NOT NULL,
  `Fec_Salida` datetime DEFAULT NULL,
  `Fec_Entrada` datetime DEFAULT NULL,
  `Dia_Salida` enum('Miercoles','Domingo','Findesemana') NOT NULL,
  `Alojamiento` varchar(30) NOT NULL,
  `Sen_Empresa` enum('Si','No') DEFAULT NULL,
  `Direccion` varchar(45) NOT NULL,
  `Fec_Diligenciado` datetime DEFAULT NULL,
  PRIMARY KEY (`PermissionFS_Id`),
  KEY `aprenidz _idx` (`Apprentice_Id`),
  CONSTRAINT `aprenidz ` FOREIGN KEY (`Apprentice_Id`) REFERENCES `apprentice` (`id_apprentice`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionFS`
--

LOCK TABLES `permissionFS` WRITE;
/*!40000 ALTER TABLE `permissionFS` DISABLE KEYS */;
INSERT INTO `permissionFS` VALUES (6,1076200170,'Dolores','2025-05-21 14:01:32','2025-05-21 14:01:32','Miercoles','Casa familiar','No','Vereda','2025-05-21 00:00:00'),(7,1076200170,'Brasil','2025-05-21 16:35:38','2025-05-21 16:35:38','Domingo','Casa familiar','No','Tu corazon','2025-05-21 00:00:00'),(8,1076200170,'Cartagena','2025-05-21 17:35:08','2025-05-21 17:35:08','Miercoles','2-3','No','El cielo','2025-05-21 00:00:00'),(9,1076200170,'Cartagena','2025-05-15 00:00:00','2025-05-13 00:00:00','Miercoles','2-3','No','dolores','2025-05-21 00:00:00'),(10,1076200180,'Cartagena','2025-05-22 00:00:00','2025-05-23 00:00:00','Domingo','3-3','No','Ibague','2025-05-21 00:00:00'),(11,1076200180,'Pereira','2025-05-21 19:51:37','2025-05-21 19:51:37','Domingo','2-2','No','Nada','2025-05-21 00:00:00');
/*!40000 ALTER TABLE `permissionFS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissionGN`
--

DROP TABLE IF EXISTS `permissionGN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissionGN` (
  `PermissionId` int NOT NULL AUTO_INCREMENT,
  `DepartureDate` datetime NOT NULL,
  `EntryDate` datetime NOT NULL,
  `ApplicationDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Adress` varchar(35) NOT NULL,
  `Destination` varchar(50) NOT NULL,
  `Motive` varchar(45) NOT NULL,
  `Observation` varchar(50) DEFAULT NULL,
  `Status` enum('Aprobado','Rechazado','Pendiente') DEFAULT 'Pendiente',
  `Id_apprentice` int unsigned NOT NULL,
  PRIMARY KEY (`PermissionId`),
  KEY `fk_permissionGN_1_idx` (`Id_apprentice`),
  CONSTRAINT `fk_permissionGN_1` FOREIGN KEY (`Id_apprentice`) REFERENCES `apprentice` (`id_apprentice`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissionGN`
--

LOCK TABLES `permissionGN` WRITE;
/*!40000 ALTER TABLE `permissionGN` DISABLE KEYS */;
INSERT INTO `permissionGN` VALUES (48,'2025-05-23 22:12:00','2025-05-24 22:12:00','2025-05-23 22:12:40','espinal','melon','me enferme del corazon ','coazon de melon','Aprobado',1076200170),(49,'2025-05-27 00:10:00','2025-06-02 18:00:00','2025-05-27 11:11:39','Dolores ','Verdad San José ','No formación ','Nada ','Rechazado',1076200170),(50,'2025-05-27 16:00:00','2025-05-31 18:00:00','2025-05-27 11:29:44','Vereda El Palmar ','Coyaima','Visita Familiar','Fin de semana','Rechazado',1105056493),(51,'2025-05-27 04:45:00','2025-05-28 05:45:00','2025-05-27 11:45:37','Dolores ','Verdad San José ','No formación ','Nada ','Aprobado',1076200170),(54,'2025-06-03 14:58:00','2025-06-04 14:59:00','2025-06-03 13:59:44','Ibague Tolima','cosita rika ','me enferme del corazon ','hola','Rechazado',1076200170),(55,'2025-06-04 15:41:00','2025-06-10 17:43:00','2025-06-03 14:40:54','espinal','melon','me enferme del corazon ','sddd','Rechazado',1076200170),(58,'2025-06-06 10:00:00','2025-06-07 08:57:00','2025-06-06 08:58:21','espinal','melon','cita medica','hola','Aprobado',1076200170),(61,'2025-06-09 12:37:00','2025-06-09 18:41:00','2025-06-09 12:36:26','espinal','melon','Médico','qwwdwe','Aprobado',1076200170),(62,'2025-06-09 13:43:00','2025-06-10 12:43:00','2025-06-09 12:43:30','espinal','melon','Personal','hijuepiutas gonorreas ','Aprobado',1076200170);
/*!40000 ALTER TABLE `permissionGN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program`
--

DROP TABLE IF EXISTS `program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `program` (
  `Program_Id` int NOT NULL,
  `Program_Name` varchar(255) NOT NULL,
  `Area_Id` int NOT NULL,
  `State` enum('Activo','Inactivo') NOT NULL,
  PRIMARY KEY (`Program_Id`),
  KEY `fk_program_1_idx` (`Area_Id`),
  CONSTRAINT `fk_program_1` FOREIGN KEY (`Area_Id`) REFERENCES `area` (`Area_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program`
--

LOCK TABLES `program` WRITE;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
INSERT INTO `program` VALUES (1,'Análisis y desarrollo de software ',6,'Activo'),(2,'Gestion Agroenpresarial',6,'Activo'),(3,'Gestion de empresas pecuarias',2,'Activo'),(4,'Tecnologo de Gestion especies',2,'Activo'),(5,'tecnico en gestion ambiantal del peliculon',4,'Activo'),(6,'el de los tontos',5,'Activo'),(23432,'el de los tontos bien tontos',5,'Activo');
/*!40000 ALTER TABLE `program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `responsible`
--

DROP TABLE IF EXISTS `responsible`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responsible` (
  `Responsible_Id` int NOT NULL,
  `Nom_Responsible` varchar(50) NOT NULL,
  `Ape_Responsible` varchar(45) NOT NULL,
  `Tel_Responsible` bigint DEFAULT NULL,
  `RoleId` int NOT NULL,
  `State` enum('Activo','Inactivo') NOT NULL,
  `Email_Responsible` varchar(50) NOT NULL,
  PRIMARY KEY (`Responsible_Id`),
  KEY `fk_Responsible_1_idx` (`RoleId`),
  CONSTRAINT `fk_Responsible_1` FOREIGN KEY (`RoleId`) REFERENCES `role` (`Id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responsible`
--

LOCK TABLES `responsible` WRITE;
/*!40000 ALTER TABLE `responsible` DISABLE KEYS */;
INSERT INTO `responsible` VALUES (231223,'Bienestar','Murcia',3137654342,3,'Activo','w@gmail.com'),(726253,'nestor','sarmiento primo',3245896760,4,'Activo','ww@gmail.com'),(987654,'KR Bienestar','Melojalas ',3245896760,3,'Activo','guio97445@gmail.com'),(8374652,'estefany','bicanegra',3245896760,3,'Activo','rata@gmial.com'),(12435421,'Fabian Rmirez','Gomez',3245896760,4,'Activo','mewwoin@gmail.com'),(13991739,'Rosalba','Pinedaddd',3202171414,1,'Activo','rosalbapineda660@gmail.com'),(28948910,'Argeol22','Guio Pineda ',3245896760,1,'Activo','guiopinedaargeol59@gmail.com'),(34231211,'Argeol','Guio Pineda',3245896760,2,'Activo','yt@gmail.com'),(110625312,'Juan','Pérez',3001234567,1,'Activo','melon.perez@example.com'),(987624312,'Nestor','33Menor',3202171414,1,'Activo','nestor.sarbarrios@gmail.com'),(1076200180,'Juan Valentina','Devia Hernandez',3133512529,2,'Activo','juanadevia2004@gmail.com');
/*!40000 ALTER TABLE `responsible` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `Id_role` int NOT NULL AUTO_INCREMENT,
  `Name_role` varchar(50) NOT NULL,
  PRIMARY KEY (`Id_role`),
  UNIQUE KEY `Name_role` (`Name_role`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (2,'Coordinator'),(1,'Instructor'),(4,'Lider de Alojamiento'),(3,'Líder de bienestar');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `User_Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `HashedPassword` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Salt` varchar(255) DEFAULT NULL,
  `SessionCount` int NOT NULL DEFAULT '0',
  `TokJwt` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `Blockade` bit(1) NOT NULL DEFAULT b'0',
  `UserType` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `Asset` bit(1) NOT NULL DEFAULT b'1',
  `ResetToken` varchar(300) DEFAULT NULL,
  `ResetTokenExpiration` datetime DEFAULT NULL,
  `Id_Apprentice` int unsigned DEFAULT NULL,
  `Responsible_Id` int DEFAULT NULL,
  `Status_User` enum('Activo','Inactivo') DEFAULT 'Activo',
  `RefreshToken` text,
  `RefreshTokenExpiryTime` datetime DEFAULT NULL,
  PRIMARY KEY (`User_Id`),
  KEY `fk_user_1_idx` (`Id_Apprentice`),
  KEY `fk_user_2_idx` (`Responsible_Id`),
  CONSTRAINT `fk_user_1` FOREIGN KEY (`Id_Apprentice`) REFERENCES `apprentice` (`id_apprentice`),
  CONSTRAINT `fk_user_2` FOREIGN KEY (`Responsible_Id`) REFERENCES `responsible` (`Responsible_Id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (27,'murcia21.gmz@gmail.com','/jajK3WnPx2Cr1NzkcWCxvKNKWOKlPJGeRNJBtbGLYs=','GqrmukDKJYb92h3tQ5OZZQ==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im11cmNpYTIxLmdtekBnbWFpbC5jb20iLCJyb2xlIjoiQXByZW5kaXoiLCJhdWQiOiJCaWVuZXNvZnRDbGllbnQiLCJpc3MiOiJCaWVuZXNvZnRBUEkiLCJleHAiOjE3NTAwODA1ODUsImlhdCI6MTc1MDA3Njk4NSwiSWRfQXBwcmVudGljZSI6IjEwNzYyMDAxNzAiLCJGdWxsTmFtZSI6IkZhYmlhbiBEYXJpbyAgR29tZXogTXVyY2lhICIsIm5iZiI6MTc1MDA3Njk4NX0.5hSm8hsVLV1mxSDmOJyiNp1nLp3HqsEpiiooEZ5TJkA',_binary '\0','Aprendiz',_binary '','OWE0MDI5ZWMtZDk0YS00M2M1LWFlMDctM2FiZTY4NzNjYmZi','2025-06-09 18:19:43',1076200170,NULL,'Activo',NULL,NULL),(28,'juanadevia2004@gmail.com','nAjPdyb7qCVoWCeEmdmcYu4YrN75luR1sQYIyJKzd9E=','S448PuMJ5Oi7HRxKuRtwiA==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5hZGV2aWEyMDA0QGdtYWlsLmNvbSIsInJvbGUiOiJSZXNwb25zYWJsZSIsImF1ZCI6IkJpZW5lc29mdENsaWVudCIsImlzcyI6IkJpZW5lc29mdEFQSSIsImV4cCI6MTc0NjQ1NjY1OCwiaWF0IjoxNzQ2NDU0ODU4LCJSZXNwb25zaWJsZV9JZCI6IjEwNzYyMDAxODAiLCJGdWxsTmFtZSI6Ikp1YW4gVmFsZW50aW5hIERldmlhIEhlcm5hbmRleiIsIm5iZiI6MTc0NjQ1NDg1OH0.FztZRS3GxomqZycLSsg62DyBy8o-VVnhUAnejgtxuKE',_binary '\0','Responsable',_binary '',NULL,NULL,NULL,1076200180,'Activo',NULL,NULL),(29,'guio@gmail.com','9sxE9oFOZDbxEXdgkU+Jdu7O8cYPFy8I67wUz94ZYG0=','ZDcWPdgkhHDPlqkIzaIw7Q==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InpoYXlhbmFxdWluQGdtYWlsLmNvbSIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiYXVkIjoiQmllbmVzb2Z0Q2xpZW50IiwiaXNzIjoiQmllbmVzb2Z0QVBJIiwiZXhwIjoxNzQ2NDU2NTc4LCJpYXQiOjE3NDY0NTQ3NzgsIm5iZiI6MTc0NjQ1NDc3OH0.pJ4XXdlQlJIAWqAfNJnx4fwZiZ9mQZbpdFAgZKqRBXI',_binary '\0','Administrador',_binary '',NULL,NULL,1076200180,NULL,'Activo',NULL,NULL),(30,'guiopinedaargeol79@gmail.com','UMRSOPu1DqX0pBgm4MvQO/pHisMD+dSCSkuVx6dM5oE=','gEGkzC0+dkWVnY+ZBmPwmw==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aW9waW5lZGFhcmdlb2w3OUBnbWFpbC5jb20iLCJyb2xlIjoiQWRtaW5pc3RyYWRvciIsImF1ZCI6IkJpZW5lc29mdENsaWVudCIsImlzcyI6IkJpZW5lc29mdEFQSSIsImV4cCI6MTc1MDA4NzI0MywiaWF0IjoxNzUwMDgzNjQzLCJuYmYiOjE3NTAwODM2NDN9.s-yUnOr-YMZdeUFkcXaKatKB_C8G2zxnpIWew_ELZzk',_binary '\0','Administrador',_binary '','NzE5YjJmYmItMmZhOS00ZjZhLWE3NTQtMGRjYTdlYjI3ZGQx','2025-05-26 21:00:55',NULL,NULL,'Activo','423c7df7-1e20-4937-bc66-1c98ee35a756','2025-06-23 14:20:44'),(31,'guiopinedaargeol59@gmail.com','UKH41tHPEtBTbnq7VtFLzy08j3nskfpJPo93TMil63A=','xncUCYkYHOqMyEBTua663g==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aW9waW5lZGFhcmdlb2w1OUBnbWFpbC5jb20iLCJyb2xlIjoiUmVzcG9uc2FibGUiLCJhdWQiOiJCaWVuZXNvZnRDbGllbnQiLCJpc3MiOiJCaWVuZXNvZnRBUEkiLCJleHAiOjE3NDk5NTQ4ODUsImlhdCI6MTc0OTk1MTI4NSwiUmVzcG9uc2libGVfSWQiOiIyODk0ODkxMCIsIkZ1bGxOYW1lIjoiQXJnZW9sMjIgR3VpbyBQaW5lZGEgIiwibmJmIjoxNzQ5OTUxMjg1fQ.ehpvbatFfo-fQUeZ_04xjEDDZ50QGMaYvGFX7gQNGEw',_binary '\0','Responsable',_binary '','OWNlMjdiYTUtM2UxOS00ODFmLThiMzItMTRkMjkxZjE3MDI4','2025-05-26 16:26:13',NULL,28948910,'Activo','31aa3238-9f99-4704-8576-d22ee16dd7ad','2025-06-22 01:34:45'),(32,'melon.perez@example.com','m/K0s19M9Bh3PirshXgqLOZsRizRkkFuxhh/Iwkl/Nk=','7Zlk4L0yhBouTo3jPB8arg==',0,NULL,_binary '\0','Responsable',_binary '',NULL,NULL,NULL,110625312,'Activo',NULL,NULL),(33,'yt@gmail.com','FHiYXoFaEL771cAexOenSTDp15SmbWbpIpNqnZKLC+U=','wk7p0r4loWwLTYSco/Fvyw==',0,NULL,_binary '\0','Responsable',_binary '',NULL,NULL,NULL,34231211,'Activo',NULL,NULL),(34,'rata@gmial.com','sx9qV66bJhVNdoj8b3OrSy5ZKJYsGuxGKg0DaXESKIY=','ocwzrs8epvfH2tDSbEP6/A==',0,NULL,_binary '\0','Responsable',_binary '',NULL,NULL,NULL,8374652,'Activo',NULL,NULL),(35,'w@gmail.com','okRJkXGwUP1TG2M7MAsSdL4eaoXBrqUib4HQIdS61mU=','Oe5GNSRGsF40jvfvvHvfaA==',0,NULL,_binary '\0','Responsable',_binary '',NULL,NULL,NULL,231223,'Activo',NULL,NULL),(36,'ww@gmail.com','K9mgSaMR/0igCXO5+NCmeImIGuhCyhGu2YkfpHZ9Ktw=','/ZaWQ1QjqmrGVx3b3TKzuQ==',0,NULL,_binary '\0','Responsable',_binary '',NULL,NULL,NULL,726253,'Activo',NULL,NULL),(38,'rosalbapineda660@gmail.com','4MMW3L2lUR3CRytr1kRkZe3Q+kw6nQu7dG75DrKL600=','EB90WvkfjIWKA7of/6ZRAg==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvc2FsYmFwaW5lZGE2NjBAZ21haWwuY29tIiwicm9sZSI6IlJlc3BvbnNhYmxlIiwiYXVkIjoiQmllbmVzb2Z0Q2xpZW50IiwiaXNzIjoiQmllbmVzb2Z0QVBJIiwiZXhwIjoxNzQ5NDkyMzQ0LCJpYXQiOjE3NDk0OTA1NDQsIlJlc3BvbnNpYmxlX0lkIjoiMTM5OTE3MzkiLCJGdWxsTmFtZSI6IlJvc2FsYmEgUGluZWRhZGRkIiwibmJmIjoxNzQ5NDkwNTQ0fQ.SGP1DbdU-xL8C7sOW5uWXNszLfxDOYmGdacgiT8MDBQ',_binary '\0','Responsable',_binary '',NULL,NULL,NULL,13991739,'Activo',NULL,NULL),(39,'nestor.sarbarrios@gmail.com','mCpNzOeGtw4vX+nFgkzXr0ERlW2yjdek+8cEwg5L1VI=','CvQk6aqYw3qSDmDrrfJLZw==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5lc3Rvci5zYXJiYXJyaW9zQGdtYWlsLmNvbSIsInJvbGUiOiJSZXNwb25zYWJsZSIsImF1ZCI6IkJpZW5lc29mdENsaWVudCIsImlzcyI6IkJpZW5lc29mdEFQSSIsImV4cCI6MTc0OTQ5MTk0OCwiaWF0IjoxNzQ5NDkwMTQ4LCJSZXNwb25zaWJsZV9JZCI6Ijk4NzYyNDMxMiIsIkZ1bGxOYW1lIjoiTmVzdG9yIDMzTWVub3IiLCJuYmYiOjE3NDk0OTAxNDh9.hNiRj2rYAp8EUJ-X4rkQLfgkq16l1fCbP4JsmY4IcCs',_binary '\0','Responsable',_binary '',NULL,NULL,NULL,987624312,'Activo',NULL,NULL),(40,'guio97445@gmail.com','jlrvK+wnBVngfvwXdihdyF/MUAZx6EqJMv04jgCyYrg=','zKgpQCGqIpznHYEC0VWl5Q==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1aW85NzQ0NUBnbWFpbC5jb20iLCJyb2xlIjoiUmVzcG9uc2FibGUiLCJhdWQiOiJCaWVuZXNvZnRDbGllbnQiLCJpc3MiOiJCaWVuZXNvZnRBUEkiLCJleHAiOjE3NDk0OTE5NTAsImlhdCI6MTc0OTQ5MDE1MCwiUmVzcG9uc2libGVfSWQiOiI5ODc2NTQiLCJGdWxsTmFtZSI6IktSIEJpZW5lc3RhciBNZWxvamFsYXMgIiwibmJmIjoxNzQ5NDkwMTUwfQ.sfv0aOuh4wQgQL7oCZYqMHV7DRyYp0FbCiKa5QJqi2k',_binary '\0','Responsable',_binary '',NULL,NULL,NULL,987654,'Activo',NULL,NULL),(41,'mewwoin@gmail.com','zZOZZxBEGgtwt7YmOxfe+65+z5E8CCHbLx6GXPgH/PA=','BB71NR/pbVsyut/D++2ysQ==',0,NULL,_binary '\0','Responsable',_binary '',NULL,NULL,NULL,12435421,'Activo',NULL,NULL),(42,'cmiloty1680@gmail.com','ogsFFPfqs6avoCt7y2UTTwdFEriNu6yAUHxVgnYQBP0=','mtVrPkI/Wk2b2qlgWnPkvQ==',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNtaWxvdHkxNjgwQGdtYWlsLmNvbSIsInJvbGUiOiJBcHJlbmRpeiIsImF1ZCI6IkJpZW5lc29mdENsaWVudCIsImlzcyI6IkJpZW5lc29mdEFQSSIsImV4cCI6MTc0ODM3Mjg2NSwiaWF0IjoxNzQ4MzYzMjY1LCJJZF9BcHByZW50aWNlIjoiMTEwNTA1NjQ5MyIsIkZ1bGxOYW1lIjoiQ3Jpc3RpYW4gQ2FtaWxvICBUaXF1ZSBUaXF1ZSIsIm5iZiI6MTc0ODM2MzI2NX0.DkkcoHcIBNM3f8YJR7MiKp1nqotrC5BQkJcIrRKqc2A',_binary '\0','Aprendiz',_binary '',NULL,NULL,1105056493,NULL,'Activo',NULL,NULL),(43,'puentessantiago2003@gmail.com','PKyJXhy+YvC+iiwe8fXB34w7PU8hUHB8q7HtfYa4kjg=','MWchQFqFJrldHo3UVqGtKA==',0,NULL,_binary '\0','Administrador',_binary '',NULL,NULL,NULL,NULL,'Activo',NULL,NULL),(44,'guioq@gmial.com','sSWZGvmDSv+8NSNqz++fnk4MASLmQ0/Qol0NtWEJcqI=','zg2asFvx9XQmkU42DR8rDw==',0,NULL,_binary '\0','Aprendiz',_binary '',NULL,NULL,1105640150,NULL,'Activo',NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16 11:30:36
