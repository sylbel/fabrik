<?php
/**
*
* @package fabrikar
* @author Rob Clayburn
* @copyright (C) Rob Clayburn
* @license http://www.gnu.org/copyleft/gpl.html GNU/GPL
*/

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

//require the abstract plugin class
require_once(COM_FABRIK_FRONTEND.DS.'models'.DS.'plugin.php');
require_once(COM_FABRIK_FRONTEND.DS.'models'.DS.'validation_rule.php');

class plgFabrik_ValidationruleUserExists extends plgFabrik_Validationrule
{

	var $_pluginName = 'userexists';

	/** @param string classname used for formatting error messages generated by plugin */
	var $_className = 'userexists';

	/**
	 * validate the elements data against the rule
	 * @param string data to check
	 * @param object element
	 * @param int plugin sequence ref
	 * @return bol true if validation passes, false if fails
	 */

	function validate($data, &$element, $c)
	{
		$params = $this->getParams();
		$c = trim((string)$c);
		//as ornot is a radio button it gets json encoded/decoded as an object
		$ornot = (object)$params->get('userexists_or_not');
		$ornot = isset($ornot->$c) ? $ornot->$c : 'fail_if_exists';
		jimport('joomla.user.helper');
		$id = 0;
		if (!$id = JUserHelper::getUserId($data)) {
			if ($ornot == 'fail_if_exists') {
				return true;
			}
		}
		else {
			if ($ornot == 'fail_if_not_exists') {
				return true;
			}
		}
		return false;
	}

}
?>