class Notifier
	@notify:(title, message = '')->
		exec("osascript -e 'display notification \"#{message}\" with title \"#{title}\"'")
