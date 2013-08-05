<?php
	class DB_Interface{
		private $_dsn;
		private $_id;
		private $_passwd;
		private $_conn;
		private $_driver = array('sqlite','sqlite2','mysql');
		public function __construct($dsn='',$id='',$passwd=''){
			try{
				if ($this->__isVaildDSN($dsn))
					$this->_dsn = $dsn;
			}catch(PDOException $e){
				echo 'Constructor Faild : '. $e->getMessage();
				exit;
			}
			$this->_id = $id;
			$this->_passwd = $passwd;
			if (empty($this->_conn))
					$this->connect($this->_dsn);
		}
		private function __isVaildDSN($dsn){
			if (!is_string($dsn) || empty($dsn))
				throw new PDOException("DSN is null.\n");
			if (false === preg_match('/(.+)\:.+/i', $dsn,$result))
				throw new PDOException("Invaild data source name.\n");
			if (false === (in_array($result[1],$this->_driver)))
				throw new PDOException("Invaild PDO Drivers.\n");
			return true;
		}
		private function __displayErrorMsg(){
			print_r($this->_conn->errorInfo());
		}
		public function connect(){
			try {
				$this->_conn = new PDO($this->_dsn,$this->_id,$this->_passwd);
			}catch(PDOException $e){
				echo 'Connection Failed: '. $e->getMessage();
				exit;
			}
		}
		public function disconnect(){
			
		}
		public function query($sql=''){
			$sql = trim($sql);
			if (empty($sql))
				return false;
			if ('select' === strtolower(substr($sql,0,6)))
				$result = $this->_conn->query($sql) or $this->__displayErrorMsg(); 
			else
				$result = $this->_conn->exec($sql) or $this->__displayErrorMsg();
			return $result;
		}
		public function query_list($sql=''){
			$result = array();
			$temp = $this->query($sql);
			if ($temp){
				foreach ($temp->fetchAll(PDO::FETCH_ASSOC) as $data)
					$result[] = $data;
			}	
			return $result;
		}
		public function insert_id(){
			return $this->_conn->lastInsertId();
		}
	}
?>