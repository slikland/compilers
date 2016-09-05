<?php
namespace slikland\utils\net;
class File
{
	static function mkdir($path, $chmod = 0777)
	{
		if(!file_exists($path))
		{
			self::mkdir(dirname($path), $chmod);
			mkdir($path, $chmod);
		}
		return TRUE;
	}

	static function upload($fileObj, $dir, $name = NULL)
	{
		if(file_exists($fileObj['tmp_name'])){
			if(!$name)
			{
				$name = $fileObj['name'];
			}
			
			$dir = rtrim($dir, '/') . '/';
			self::mkdir($dir);

			if(move_uploaded_file($fileObj['tmp_name'], $dir . $name))
			{
				return $dir.$name;
			}
		}
		return FALSE;
	}

	static function toRelative($url, $rootURL = ROOT_URL)
	{
		if(preg_match('/^https?\:\\/\\//', $url))
		{
			$url = preg_replace('/^https?\:\\/\\//i', '', $url);
			$rootURL = preg_replace('/^https?\:\\/\\//i', '', $rootURL);
			return str_replace($rootURL, '', $url);
		}
		return $url;
	}

	static function toURL($path)
	{
		$path = self::toRelative($path);
		$path = str_replace(ROOT_PATH, '', $path);
		return ROOT_URL . $path;
	}


}
?>