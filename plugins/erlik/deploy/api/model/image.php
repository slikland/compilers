<?php
namespace model;

class image extends Model
{
	function __construct(){

	}

	function upload($params)
	{
		$relative = 'dynamic/uploads/';
		$uid = uniqid();
		$name = $uid . '.png';
		$path = ROOT_PATH . $relative;
		$url = ROOT_URL . $relative;
		$image = \slikland\utils\net\File::upload($_FILES['image'], $path, $name);
		return array('url'=>$url . $name);
	}

	function resize()
	{
		$resized = \slikland\utils\media\Image::resize($image, 200, 100, true, $path);
	}

	function crop($params)
	{
		$original = $params['image'];
		$pathInfo = pathinfo($original);
		$name = $pathInfo['filename'];
		$extension = $pathInfo['extension'];
		$original = ROOT_PATH . \slikland\utils\net\File::toRelative($original);
		$sizes = $params['sizes'];
		if(is_string($sizes))
		{
			$sizes = json_decode($sizes, TRUE);
		}

		$convertedSizes = [];

		foreach($sizes as $size)
		{
			$relative = 'dynamic/cropped/' . $name . $size['id'].'.'.$extension;
			$path = ROOT_PATH . $relative;
			$url = ROOT_URL . $relative;
			$size['url'] = $url;
			$convertedSizes[] = $size;

			$converted = \slikland\utils\media\Image::crop($original, $size['bounds'], $size['size'], $path);
		}

		return array('image'=>$params['image'], 'sizes' => $convertedSizes);
	}
}

?>