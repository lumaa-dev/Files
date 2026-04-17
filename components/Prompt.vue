<template>
  <div class="prompt unint">
    <div class="form">
      <p class="title">Admin Password</p>
      <input type="text" name="password" id="password">
      <button @click="login">Login</button>
    </div>
  </div>
</template>

<style scoped>
.prompt {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #161d2ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  user-select: all;
  pointer-events: all;
}

.prompt.hidden {
  opacity: 0;
}

.form {
  background-color: #060b14;
  border-radius: 21px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form .title {
  font-size: 1.3em;
  font-weight: 900;
  text-align: center;
}

input[type="text"] {
  color: #fff;
  border: none;
  outline: none;
  background: #1d1d27;
  padding: 10px 10px;
  border-radius: 25px;
}
</style>

<script lang="ts" setup>
const props = defineProps({
  onSuccess: {
    type: Function,
    default: () => {}
  }
})

async function login() {
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const { data: res } = await useAsyncData("password-" + password, async () => {
    const response: boolean = await $fetch<any>(`/api/admin`, {
      method: 'GET',
      headers: {
        'Authorization': password
      }
    });
    return response;
  });

  document.querySelector('.prompt')!.classList.add('hidden');
  if (!res.value) {
    useRouter().push('/')
  } else {
    useCookie("auth").value = password;
    props.onSuccess();
  }
}
</script>