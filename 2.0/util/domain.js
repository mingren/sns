KISSY.add('KISSY.sns.domain', function(S) {

	var win = window,
		doc = document,
		Domain;

	/**
	 * @class ��ȡ������ domain
	 * @memberOf SNS
	 * @author ��Ȼ
	 */

	Domain = {

		/**
		 * @lends SNS.Domain.prototype
		 */

		/**
		 * ��ȡ domain
		 * @param { Number } depth  ��ѡ��������ȡ����ȣ�Ĭ��Ϊ 2.
		 * @param { String } host  ��ѡ������Ĭ��Ϊ��ǰ uri.
		 * @return { String }
		 */
		get: function(depth, host) {

			var hs = host || location.hostname,
				dp = depth || 2,
				parts = hs.split('.'),
				ret = [];

			while (parts.length && dp--) {

				ret.unshift(parts.pop());

			}

			return ret.join('.');

		},

		/**
		 * ���õ�ǰ domain
		 * @param { Number | String } value  ��ǰ uri ����Ȼ���Ҫ���õ� domain �ַ���.
		 * @return { Object } Domain 
		 */
		set: function(value) {

			var that = this;

			doc.domain = S.isString(value) ? value : that.get(value);

			return that;

		}

	};

	S.namespace('KISSY.sns').domain = Domain;

});
