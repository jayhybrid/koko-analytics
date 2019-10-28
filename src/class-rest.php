<?php

namespace AAA;

class Rest
{
	public function init()
	{
		add_action( 'rest_api_init', array($this, 'register_routes'));
	}

	function register_routes()
	{
		register_rest_route( 'aaa-stats/v1', '/stats', array(
			'methods' => 'GET',
			'callback' => array($this, 'get_stats'),
			'args' => array(
				'start_date' => array(
					'validate_callback' => 'is_string'
				),
				'end_date' => array(
					'validate_callback' => 'is_string'
				),
				'period' => array(
					'default' => 'this_month',
				),
			),
			'permission_callback' => function () {
				return current_user_can( 'manage_options' );
			}
		));
	}

	public function get_stats(\WP_REST_Request $request)
	{
	    global $wpdb;

	    $result = $wpdb->get_results("SELECT date, visitors, pageviews FROM {$wpdb->prefix}aaa_stats s WHERE s.id = 0");

		return $result;
	}

}
