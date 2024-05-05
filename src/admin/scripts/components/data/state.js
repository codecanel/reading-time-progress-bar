export const defaultColorProps = {
	hex: '',
	rgb: {},
	hsv: {},
	hsl: {},
	source: 'hex',
	oldHue: 0,
};

export const defaultPaddingProps = {
	top: '0',
	right: '20px',
	bottom: '0',
	left: '20px',
};

export default {
	is_saved: false,
	is_general_control_save_request_sending: false,

	// General Settings
	is_reading_time_disable: false,
	is_reading_progress_bar_disable: false,
	is_general_control_changes: false,
	is_general_control_saved_error: false,
	is_general_control_saved_success: false,
	post_type: [ { label: 'Posts', value: 'post' } ],
	words_per_minute: 200,
	include_comments: false,
	include_images: false,
	images_per_minute: 4,
	estimated_position: [
		{ label: 'Single Post', value: 'single' },
		{ label: 'Archive Page', value: 'archive' },
	],

	// Reading Time
	show_on_specific_pages: false,
	use_reading_time_custom_css: false,
	reading_time_text_position: {
		label: 'Above The Title',
		value: 'after-title',
	},
	reading_time_text_prefix: 'Reading Time',
	reading_time_text_suffix: ' mins',
	reading_time_text_suffix_singular: ' min',
	reading_time_text_font: { label: 'Default', value: { fontFamily: '' } },
	reading_time_text_font_style: { label: 'Default', value: '' },
	reading_time_text_font_subset: { label: 'Default', value: '' },
	reading_time_text_font_text_align: { label: 'Default', value: '' },
	reading_time_text_font_size: '14',
	reading_time_text_color: { r: '29', g: '35', b: '39', a: '1' },
	reading_time_text_bg_color: { r: '238', g: '238', b: '238', a: '1' },
	reading_time_text_font_line_height: '1.5',
	reading_time_custom_css_data: '',

	// Progress bar.
	is_progress_bar_control_changes: false,
	is_progress_bar_styles_changes: false,
	progress_bar_style: { label: 'Default', value: '' },
	progress_bar_position: { label: 'Top', value: 'top' },
	progress_bar_height: 10,
	progress_bar_offset: 0,
	progress_bar_content_offset: 0,
	progress_bar_rtl_support: false,
	progress_bar_sticky: false,
	progress_bar_fg_offset: 100,
	progress_bar_bg_offset: 100,
	progress_bar_foreground_color: { r: '29', g: '35', b: '39', a: '1' },
	progress_bar_background_color: { r: '201', g: '210', b: '225', a: '1' },
	progress_bar_border_radius: 0,
	use_progress_bar_custom_css: false,
	progress_bar_custom_css_data: '',

	// Export and Import
	is_settings_imported: false,
	is_settings_exported: false,
	upload_from_clipboard: false,
	is_settings_import_error: false,
	is_settings_import_success: false,
};
