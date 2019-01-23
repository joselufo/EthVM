<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" page-type="pending" :loading="txsLoad" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Tx } from '@app/core/models'
import { Events } from 'ethvm-common'

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs
  }
})
export default class PagePendingTxs extends Vue {
  // Lifecycle
  created() {
    this.$socket.emit(
      Events.getPendingTxs,
      {
        limit: 100,
        page: 0
      },
      (err, pTxs) => {
        this.$store.commit(Events.newPendingTx, pTxs)
        if (pTxs && pTxs.length > 0) {
          this.$eventHub.$emit(Events.newPendingTx)
        }
      }
    )
  }

  // Computed
  get txs(): Tx[] {
    return this.$store.getters.pendingTxs
  }

  get txsLoad(): boolean {
    return this.txs.length === 0
  }

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.pending'),
        disabled: true
      }
    ]
  }
}
</script>