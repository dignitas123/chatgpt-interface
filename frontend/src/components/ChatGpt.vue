<template>
  <q-card class="my-card q-ma-md">
    <q-card-section>
    <div class="q-pa-md">
    <div class="q-gutter-y-md column">
      <q-input ref="inputRef" v-model="question" label="Question" :loading="loadingState" :rules="[val => !!val || loadingStateFinished || 'Question can\'t be empty.']" clearable @keyup.enter="fetchAnswer">
        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="fetchAnswer" />
        </template>
        </q-input>
        <template v-for="(answer, i) in answers" :key="answer">
          <div class="q-mt-md"><i>You:</i> {{ questions[i] }}</div>
          <q-input
            v-model="answers[i]"
            filled
            autogrow
            readonly
          />
        </template>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch,} from "vue";

const inputRef = ref<any | null>(null)

const question = ref('');
const questions = ref<string[]>([]);
const answers = ref<string[]>([]);
const loadingState = ref(false);
const loadingStateFinished = ref(false);

watch(question, (after, before) => {
  if(before === "" && after.length > 0) {
    loadingStateFinished.value = false;
  }
})

async function fetchAnswer() {
  try {
    loadingState.value = true;
    const res = await fetch("http://localhost:8000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.value
      })
    })
    const data = await res.json();
    const parsedData = data.bot.trim();
    answers.value.unshift(parsedData);
    questions.value.unshift(question.value)
  } catch(error) {
    console.error(error);
  } finally {
    loadingState.value = false;
    loadingStateFinished.value = true;
    question.value = ''
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 500px;
}
</style>