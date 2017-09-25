<?php
class App {
	function __construct($dbOptions) {
		$this->db = mysql_connect( $dbOptions['host'], $dbOptions['userName'], $dbOptions['password'] ) or die( mysql_error() );
		mysql_select_db( $dbOptions['dbName'], $this->db ) or die( mysql_error() );
	}

	function __destruct() {
		mysql_close( $this->db ) or die( mysql_error() );
	}

	function getAll() {
		return $this->dbReq("SELECT * FROM ad", true);
	}

	function update($id, $title, $content){

		return $this->dbReq("
			UPDATE ad SET
				title = '".$title."',
				content = '".$content."',
				updated = CURRENT_TIMESTAMP
			WHERE id = ".$id
		);
	}

	function add($title, $content) {
		$this->dbReq("
			INSERT INTO ad
				(
					title,
					content,
					updated
				)
			VALUES
				(
					'".$title."',
					'".$content."',
					CURRENT_TIMESTAMP
				)
		");

		return $this->dbReq("SELECT * FROM ad WHERE id = ".mysql_insert_id(), true) [0];
	}

	function remove ($id) {
		return $this->dbReq("DELETE FROM ad WHERE id = ".$id);
	}

	private function dbReq( $query, $needReturn = false ){
		$return = [];
		$result = mysql_query( $query, $this->db ) or die( mysql_error() );

		if ( !$result ) return 1;
		if ( !$needReturn ) return 0;

		while ( $data = mysql_fetch_assoc( $result ) ){
			$return[] = $data;
		};

		return $return;
	}
}

header("Access-Control-Allow-Origin: *");

$app = new App(include "dbOptions.php");

if ($_GET) {
	switch ($_GET["type"]) {
		case "remove":
			echo $app->remove(
				preg_replace( '/\D/', '', $_GET["id"] )
			);
			break;
		case "update":
			if (!count($_GET["title"]) && !count($_GET["content"])) return;
			echo $app->update(
				preg_replace( '/\D/', '', $_GET["id"] ),
				($_GET["title"]),
				($_GET["content"])
			);
			break;
		case "add":
			if (!count($_GET["title"]) && !count($_GET["content"])) return;
			echo json_encode( $app->add(
				($_GET["title"]),
				($_GET["content"])
			) );
			break;
	}
};

if ( !count( $_GET ) ) {
	echo  json_encode( $app->getAll() );
};
?>
