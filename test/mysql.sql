DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `join_date` date DEFAULT NULL,
  `info` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
INSERT INTO `employee` VALUES (1,'Sherlock','Holmes','2010-01-01','{\"foo\":\"happy\",\"bar\":\"sad\"}'),(2,'John','Watson','2010-01-02','{\"foo\":\"apple\",\"bar\":\"banana\"}'),(3,'Joe','Zhang','2010-02-03','{\"foo\":\"student\",\"bar\":\"teacher\"}');
UNLOCK TABLES;
