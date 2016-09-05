<?php
namespace slikland\utils\media;
class Image
{
	private static function isGD($im)
	{
		if(is_resource($im))
		{
			if(get_resource_type($im) == 'gd')
			{
				return TRUE;
			}
		}

		return FALSE;

	}

	private static function newImage($width, $height, $bgColor = NULL)
	{
		$im = imagecreatetruecolor($width, $height);

		imagesavealpha($im, true);
		$alpha = imagecolorallocatealpha($im, 255, 255, 255, 0); 
		imagefill($im, 0, 0, $alpha);

		if(!is_null($bgColor))
		{
			$r = $bgColor >> 16 & 0xFF;
			$g = $bgColor >> 8 & 0xFF;
			$b = $bgColor & 0xFF;
			$color = imagecolorallocatealpha($im, $r, $g, $b, 127); 
			imagefill($im, 0, 0, $color);
		}

		return $im;
	}

	private static function save($im, $path)
	{
		$dir = dirname($path);
		\slikland\utils\net\File::mkdir($dir);

		$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
		switch($ext)
		{
			case 'png':
				$result = imagepng($im, $path);
				break;
			case 'jpg':
			case 'jpeg':
				$result = imagejpeg($im, $path);
				break;
			case 'gif':
				$result = imagegif($im, $path);
				break;
			default:
				$result = NULL;
				break;
		}
		return $result;
	}

	private static function getSize($im)
	{
		if(self::isGD($im))
		{
			$size = array(imagesx($im), imagesy($im));
		}else{
			$size = getimagesize($im);
		}

		return $size;
	}

	private static function getImage($path)
	{
		if(self::isGD($path)){
			return $path;
		}

		$type = '';
		try{
			$finfo = new \finfo(FILEINFO_MIME);
			$type = $finfo->file($path);
		}catch(Exception $e)
		{
			$type = mime_content_type($path);
		}

		if(strlen($type) == 0)
		{
			$ext = pathinfo($path, PATHINFO_EXTENSION);
			$type = $ext;
		}


		$type = strtolower(preg_replace('/^(.*?\\/.*?)(;.*)?$/', '$1', $type));
		$type = preg_replace('/^(?:image\\/)?([a-z0-9]+)/', '$1', $type);

		switch($type)
		{
			case 'png':
				$im = imagecreatefrompng($path);
				break;
			case 'jpg':
			case 'jpeg':
				$im = imagecreatefromjpeg($path);
				break;
			case 'gif':
				$im = imagecreatefromgif($path);
				break;
			default:
				$im = NULL;
				break;
		}
		if(!$im)
		{
			throw new Error('Image format is not supported.');
		}
		return $im;
	}

	static function convert($im, $output = NULL)
	{
		$source = self::getImage($im);

		if($output)
		{
			return self::save($source, $output);
		}else{
			return $source;
		}
		return FALSE;

	}

	static function resize($im, $width = 0, $height = 0, $fit = FALSE, $output = NULL)
	{
		$source = self::getImage($im);
		$size = self::getSize($source);
		$w = $size[0];
		$h = $size[1];

		$ratio = $w / $h;
		if((is_nan($width) || $width <= 0) && (is_nan($height) || $height <= 0))
		{
			throw new Error('Image size is not set.');
		}

		if(is_nan($width) || $width <= 0)
		{
			$width = $height * $ratio;
		}

		if(is_nan($height) || $height <= 0)
		{
			$height = $width / $ratio;
		}

		if($fit)
		{
			if($width / $height < $ratio)
			{
				$s = $width / $w;
			}else{
				$s = $height / $h;
			}
		}else{
			if($width / $height > $ratio)
			{
				$s = $width / $w;
			}else{
				$s = $height / $h;
			}

		}

		$nw = $s * $w;
		$nh = $s * $h;

		$out = self::newImage($width, $height);

		$px = ($width - $nw) * 0.5;
		$py = ($height - $nh) * 0.5;

		imagecopyresampled($out, $source, $px, $py, 0, 0, $nw, $nh, $w, $h);

		if($output)
		{
			return self::save($out, $output);
		}else{
			return $out;
		}

	}

	// Bounds object format:
	// array(x, y, w, h)
	// array(0, 0, 0.5, 0.5) // Will use as percentage if all values are less or equal 1
	// array(0, 0, 100, 50) // Will use absolte pixel values if some values are more than 1
	// array('x'=>0, 'y'=> 0, 'w'=>0.5, 'h'=>0.5)
	// array('x'=>0, 'y'=> 0, 'w'=>100, 'h'=>50)

	static function crop($im, $bounds, $outSize, $output = NULL)
	{
	// static function resize($im, $width = 0, $height = 0, $fit = FALSE, $output = NULL)

		if(isset($bounds['x']) && isset($bounds['y']) && isset($bounds['w']) && isset($bounds['h']))
		{
			$x = $bounds['x'];
			$y = $bounds['y'];
			$w = $bounds['w'];
			$h = $bounds['h'];
		}else if(isset($bounds[0]) && isset($bounds[1]) && isset($bounds[2]) && isset($bounds[3]))
		{
			$x = $bounds[0];
			$y = $bounds[1];
			$w = $bounds[2];
			$h = $bounds[3];

		}else{
			throw new Error('Invalid bounds format.');
		}

		$source = self::getImage($im);
		$size = self::getSize($source);

		if($x <= 1 && $y <= 1 && $w <= 1 && $h <= 1)
		{
			$x *= $size[0];
			$y *= $size[1];
			$w *= $size[0];
			$h *= $size[1];
		}

		$out = self::newImage($outSize[0], $outSize[1]);
		imagecopyresampled($out, $source, 0, 0, $x, $y, $outSize[0], $outSize[1], $w, $h);

		if($output)
		{
			return self::save($out, $output);
		}else{
			return $out;
		}
		return FALSE;
	}

}
?>