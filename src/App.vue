<template>
	<div class="w-full h-full overflow-hidden">

		<router-view></router-view>


		<!-- 登录 -->
		<a-modal
			v-model:visible="userStore.loginVisible"
			title="登录"
			@close="handleClose"
		>
			<a-form
				ref="loginFormRef"
				:model="loginForm"
				:rules="loginRules"
			>
				<a-form-item field="user_name" label="账号">
					<a-input
						v-model="loginForm.user_name"
						placeholder="请输入账号"
						allow-clear
					/>
				</a-form-item>
				<a-form-item field="user_pwd" label="密码">
					<a-input-password
						v-model="loginForm.user_pwd"
						placeholder="请输入密码"
						allow-clear
					/>
				</a-form-item>
			</a-form>

			<template #footer>
				<div class="flex-center">
					<a-button
                        size="large"
                        @click="handleCancel"
                    >取&ensp;消</a-button>
					<a-button
                        type="primary"
                        size="large"
						html-type="submit"
						:loading="loginBTN.loading"
						class="ml-10px"
						@click="loginBTN.dbFn"
                    >登&ensp;录</a-button>
				</div>
			</template>
		</a-modal>
	</div>
</template>

<script>
export default {
	name: 'App',
}
</script>

<script setup>
import { ref, reactive, shallowReactive, shallowRef, nextTick } from 'vue'

import { useRouter } from 'vue-router'

import { Message, Modal } from '@arco-design/web-vue'

import { LOGIN_API } from '@/api'

import { useUserStore } from '@/stores/userStore'

import { useButton } from '@/mixins/useCommon'

const $router = useRouter();

const userStore = useUserStore();

const loginForm = reactive({
	user_name: '',
	user_pwd: '',
}), loginRules = shallowReactive({
	user_name: [
		{ required: true, message: '请输入账号' }
	],
	user_pwd: [
		{ required: true, message: '请选择密码' }
	]
}), loginFormRef = shallowRef(null);

const handleCancel = () => {
	userStore.switchLoginVisible(false);
}

const handleLogin = async () => {

	return new Promise((resolve) => {
		loginFormRef.value.validate(async (errors) => {
			if(errors) {
				Message.warning('请先填写账号信息~');
			}else {
				const res = await LOGIN_API.POST_LOGIN(loginForm);

				if(res) {
					userStore.setToken(res?.data?.accessToken);
					userStore.switchLoginVisible(false);
					nextTick(() => {
						// 跳转
						$router.push({ name: 'produce' })
					})
				}

			}

			resolve()
		})
	})

}

const loginBTN = reactive(useButton(handleLogin))

const handleClose = () => {
	loginFormRef.value.resetFields();
}

</script>

<style lang="scss" scoped>

</style>