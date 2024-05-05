class ReadingProgressBar {
	constructor( widget, content, comments ) {
		this.pluginSettings = JSON.parse( widget.dataset.settings ) || {};
		this.widget = widget;
		this.content = content;
		this.comments = comments;

		this.screenHeight = 0;
		this.elementOffset = 0;
		this.scrollPosition = 0;

		this.checkProgress = this.checkProgress.bind( this );

		// Add events.
		window.addEventListener( 'load', this.checkProgress );
		window.addEventListener( 'resize', this.checkProgress );
		window.addEventListener( 'scroll', this.checkProgress );
	}

	/**
	 * Collect current element offset
	 *
	 * @return {number} Current element offset.
	 */
	getElementOffset() {
		const contentHeight = this.content.getBoundingClientRect().bottom; // eslint-disable-next-line
		if ('true' === this.pluginSettings.include_comments && this.comments) {
			const commentsTop = this.comments.getBoundingClientRect().top;
			const commentsBottom = this.comments.getBoundingClientRect().bottom;

			return contentHeight + ( commentsBottom - commentsTop );
		}

		return contentHeight;
	}

	/**
	 * Collect current screen height
	 *
	 * @return {number} Current screen height/
	 */
	getScreenHeight() {
		const documentHeight = document.documentElement.clientHeight;
		return Math.max( documentHeight, window.innerHeight );
	}

	/**
	 * Collect current scrolled position
	 *
	 * @return {number} The current scrolled position.
	 */
	getScrollPosition() {
		const scrollTop = document.documentElement.scrollTop;
		if ( 'true' === this.pluginSettings.include_comments && this.comments ) {
			const contentHeight = this.content.getBoundingClientRect().bottom;
			const commentsTop = this.comments.getBoundingClientRect().top;

			if ( contentHeight <= 0 && commentsTop - contentHeight !== 0 ) {
				if ( commentsTop > 0 ) {
					return scrollTop - commentsTop;
				}
				return scrollTop - ( commentsTop - scrollTop );
			}
		}

		return scrollTop;
	}

	checkProgress() {
		// Collect base context.
		const settings = this.pluginSettings;
		const progressBar = this.widget.querySelector( '.progress-bar' );
		const contentOffset = parseInt( settings.progress_bar_content_offset );

		this.elementOffset = this.getElementOffset();
		this.screenHeight = this.getScreenHeight(); // eslint-disable-next-line
		const scrollPosition = this.getScrollPosition() > contentOffset ? (this.getScrollPosition() - contentOffset) : 0;
		const countingOffset = this.elementOffset - this.screenHeight; // eslint-disable-next-line
		const calculate = ((100 * countingOffset) / (scrollPosition + countingOffset));
		const percentage = Math.abs( calculate - 100 );

		progressBar.style.width = percentage >= 100 ? '100%' : percentage + '%';
	}
}

if ( document.querySelector( '.coca-rtpb-plugin.reading-progress-bar' ) ) {
	// Collect the content section.
	const blockContent = document.querySelector( '.wp-block-post-content' );
	const classicContent = document.querySelector( '.entry-content' );
	const wrappedContent = document.querySelector( '#coca_rtpb_plugin_content' );

	// Collect the comments section.
	const legacyComments = document.querySelector( '.wp-block-post-comments' );
	const blockComments = document.querySelector( '.wp-block-comments' ); // eslint-disable-next-line
    const nextElementSibling = document.querySelector('#coca_rtpb_plugin_comments');

	new ReadingProgressBar(
		document.querySelector( '.coca-rtpb-plugin.reading-progress-bar' ),
		blockContent || classicContent || wrappedContent,
		legacyComments || blockComments || nextElementSibling
	);
}
