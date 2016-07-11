CREATE TABLE `reference` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `keypoints_url` varchar(255) DEFAULT NULL,
  `descriptors_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reference
-- ----------------------------
INSERT INTO `reference` VALUES ('1', '手机袋', 'assets/FeatureData/a_keypoints.json', 'assets/FeatureData/a_descriptors.json');
INSERT INTO `reference` VALUES ('2', '星矢卡', 'assets/FeatureData/c_keypoints.json', 'assets/FeatureData/c_descriptors.json');
