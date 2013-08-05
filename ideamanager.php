<?php
	require_once 'db.php';
	
	$DSN = 'sqlite:db/ktni.db';
	
	IdeaManager::setDSN($DSN);
	
	 function getNow(){
		return changeUnixTime(date('Y-m-d'));
	}
	function changeUnixTime($date){
		if (false ===preg_match('/\d{4}-\d{2}-\d{2}/i', $date))
			return getNow();
		list($year,$month,$day) = explode('-',$date);
		return mktime(0,0,0,$month,$day,$year);
	}
	class IdeaManager{
		public static $db;
		public static $dsn; 
		private function __construct($dsn){
			
		}	
		private function getDB(){
			if (empty(self::$db))
				self::$db = new DB_Interface(self::$dsn);
			return self::$db;
		}
		private function getJSON($result){
			return ($result===false or count($result)==0)?json_encode('[]'):json_encode($result);
		}
		public static function setDSN($dsn){
			self::$dsn = $dsn;
		}
		public static function getIdea($date){
			$result = self::getDB()->query_list("SELECT id,comment,position FROM ktni_ideas WHERE created_date = {$date}");
			echo self::getJSON($result);
		} 
		public static function modifyIdea($comment,$position,$created){
			$now = getNow();
			$temp = self::getDB()->query_list("SELECT id FROM ktni_ideas WHERE position='{$position}' and created_date = {$created}");
			$id =(count($temp))?$temp[0]['id']:'null';
			$result = self::getDB()->query("INSERT OR REPLACE INTO ktni_ideas (id,comment,position,created_date,updated_date) VALUES ({$id},'{$comment}','{$position}',{$created},{$now})");
			echo ($result)?self::getDB()->insert_id():false;
		}
		public static function getAllTags(){
			$result = self::getDB()->query_list("SELECT id,name FROM ktni_tags ORDER BY NAME");
			echo self::getJSON($result);
		}
		public static function addTags($name){
			$now = getNow();
			$result = self::getDB()->query("INSERT INTO ktni_tags (name,created_date) VALUES ('{$name}',{$now})");
			echo ($result)?self::getDB()->insert_id():false;
		}
		public static function tagging($idea,$tag){
			$now = getNow();
			$result = self::getDB()->query("INSERT INTO ktni_tagging (tag_id,idea_id,created_date) VALUES ({$tag},'{$idea}',{$now})");
			echo $result;
		}
		public static function getTags($id){
			$result = self::getDB()->query_list("SELECT tags.id,tags.name FROM ktni_tagging tagging JOIN ktni_tags tags ON tags.id = tagging.tag_id WHERE tagging.idea_id = {$id}");
			echo self::getJSON($result);
		}
		public static function getToday(){
			echo date('Y-m-d');
		}
	}
?>