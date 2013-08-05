<?php
	require_once 'ideamanager.php';

	
	if (isset($_GET['action'])){
		switch ($_GET['action']){
			case  'today':
				IdeaManager::getToday();
				break;
			case 'modify':
				$comment = trim($_GET['comment']);
				$position = trim($_GET['position']);
				$created = changeUnixTime(trim($_GET['date']));
				IdeaManager::modifyIdea($comment, $position,$created);
				break;		
			case 'get':
				$date = changeUnixTime(trim($_GET['date']));
				IdeaManager::getIdea($date);
				break;	
			case 'allTags':
				IdeaManager::getAllTags();
				break;
			case 'addTags':
				$name = trim($_GET['name']);
				IdeaManager::addTags($name);
				break;
			case 'tagging':
				$id = trim($_GET['id']);
				$tag = trim($_GET['tag']);
				IdeaManager::tagging($id, $tag);
				break;
			case 'tags':
				$id = trim($_GET['id']);
				IdeaManager::getTags($id);
				break;
		}
	}else{
		echo 'false';
	}
	
?>