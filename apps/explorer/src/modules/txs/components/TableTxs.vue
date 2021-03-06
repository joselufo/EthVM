<template>
  <v-card color="white" flat class="pt-3 pr-2 pl-2 pb-2">
    <!--
    =====================================================================================
      TITLE
    =====================================================================================
    -->
    <v-layout row wrap align-end>
      <v-flex xs7 md6 lg5 xl4 pr-0 pb-0>
        <v-layout align-end justify-start row fill-height>
          <v-card-title class="title font-weight-bold pl-2 ">{{ getTitle }}</v-card-title>
          <v-flex v-if="pageType == 'tx' && !loading" hidden-xs-only pr-0>
            <app-live-update @refreshTable="updateTable" :page-type="pageType" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs5 md6 lg7 xl8 v-if="pageType == 'home'">
        <v-layout justify-end>
          <v-btn outline color="secondary" class="text-capitalize" to="/txs">{{ $t('btn.view-all') }}</v-btn>
        </v-layout>
      </v-flex>
      <v-flex v-else xs5 md6 lg7 xl8>
        <v-layout v-if="pages > 1 && !hasError" justify-end row class="pb-1 pr-2 pl-2">
          <app-paginate v-if="isBlockDetail" :total="pages" @newPage="setPage" :current-page="page" />
          <app-paginate v-else :total="pages" @newPage="setPage" :current-page="page" :has-first="false" :has-last="false" :has-input="false" />
        </v-layout>
      </v-flex>
      <v-flex xs12 hidden-sm-and-up pt-0 v-if="pageType == 'tx' && !loading">
        <app-live-update @refreshTable="updateTable" :page-type="pageType" />
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      LOADING / ERROR
    =====================================================================================
    -->
    <v-progress-linear color="blue" indeterminate v-if="loading && !hasError" class="mt-0" />
    <app-error :has-error="hasError" :message="error" class="mb-4" />

    <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
    <v-layout>
      <v-flex hidden-sm-and-up pt-0 pb-0 pl-3> <app-footnotes :footnotes="footnotes" pl-2 pr-2 /> </v-flex>
      <v-flex hidden-xs-only sm12>
        <v-card v-if="!hasError" color="info" flat class="white--text pl-3 pr-1" height="40px">
          <v-layout align-center justify-start row fill-height pr-3>
            <v-flex xs4 sm3 md1 pl-3>
              <h5>{{ $t('block.number') }}</h5>
            </v-flex>
            <v-flex xs6 sm6 md6>
              <h5>{{ $tc('tx.hash', 1) }}</h5>
            </v-flex>
            <v-flex hidden-xs-only sm2 md1>
              <h5>{{ $t('common.eth') }}</h5>
            </v-flex>
            <v-flex hidden-sm-and-down md2>
              <h5>{{ $t('common.age') }}</h5>
            </v-flex>
            <v-flex hidden-sm-and-down md1>
              <h5>{{ $tc('tx.fee', 1) }}</h5>
            </v-flex>

            <v-flex hidden-xs-only sm1>
              <h5>{{ $t('tx.status') }}</h5>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
    <v-card flat v-if="isSyncing && pending">
      <v-layout row align-center justify-center fill-height>
        <v-card-title class="text-xs-center pt-5 pb-5">{{ $t('message.sync.no-pen-tx') }}</v-card-title>
      </v-layout>
    </v-card>
    <div v-else>
      <v-card flat v-if="!hasError" id="scroll-target" :style="getStyle" class="scroll-y" style="overflow-x: hidden">
        <v-layout column fill-height class="mb-1" v-scroll:#scroll-target>
          <v-flex xs12 v-if="!loading">
            <v-card v-for="tx in transactions" class="transparent" flat :key="tx.getHash()">
              <table-txs-row :tx="tx" :is-pending="pending" />
            </v-card>
            <v-layout v-if="pages > 1" justify-end row class="pb-1 pr-2 pl-2">
              <app-paginate v-if="isBlockDetail" :total="pages" @newPage="setPage" :current-page="page" />
              <app-paginate v-else :total="pages" @newPage="setPage" :current-page="page" :has-input="false" :has-first="false" :has-last="false" />
            </v-layout>
          </v-flex>
          <v-flex xs12 v-if="loading">
            <div v-for="i in maxItems" :key="i">
              <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-2 pr-2 pt-2">
                <v-flex xs3 sm3 md1 pl-3>
                  <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
                </v-flex>
                <v-flex xs7 sm6 md6>
                  <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
                </v-flex>
                <v-flex xs2 sm2 md1>
                  <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
                </v-flex>
                <v-flex hidden-sm-and-down md1>
                  <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
                </v-flex>
                <v-flex hidden-sm-and-down md2>
                  <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
                </v-flex>
                <v-flex hidden-xs-only sm1>
                  <v-flex xs12 style="background: #e6e6e6; height: 12px; border-radius: 2px;"></v-flex>
                </v-flex>
              </v-layout>
              <v-divider class="mb-2 mt-2" />
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts">
import AppError from '@app/core/components/ui/AppError.vue'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppLiveUpdate from '@app/core/components/ui/AppLiveUpdate.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableTxsRow from '@app/modules/txs/components/TableTxsRow.vue'
import { PendingTx, Tx, SimpleTx } from '@app/core/models'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'

@Component({
  components: {
    AppError,
    AppFootnotes,
    AppLiveUpdate,
    AppPaginate,
    TableTxsRow
  }
})
export default class TableTxs extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: Boolean, default: true }) loading!: boolean
  @Prop(String) pageType!: string
  @Prop(String) showStyle!: string
  @Prop(Array) transactions!: Tx[] | PendingTx[] | SimpleTx[]
  @Prop({ type: Number, default: 0 }) totalTxs!: number
  @Prop(Number) maxItems!: number
  @Prop(String) error!: string
  @Prop({ type: Number, default: 0 }) page!: number

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setPage(page: number): void {
    this.$emit('getTxsPage', page)
  }

  updateTable(): void {
    this.$emit('updateTable')
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get isSyncing() {
    return this.$store.getters.syncing
  }

  get hasError(): boolean {
    return this.error !== ''
  }

  get getStyle(): string {
    return this.showStyle
  }

  get getTitle(): string {
    const titles = {
      tx: this.$i18n.t('tx.last'),
      pending: this.$i18n.tc('tx.pending', 2),
      block: this.$i18n.t('block.txs')
    }
    return titles[this.pageType] || titles['tx']
  }

  get pending(): boolean {
    return this.pageType == 'pending'
  }

  get isBlockDetail(): boolean {
    return this.pageType === 'block'
  }

  get pages(): number {
    return this.totalTxs ? Math.ceil(this.totalTxs / this.maxItems) : 0
  }

  get footnotes(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('common.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('common.fail'),
        icon: 'fa fa-circle'
      }
    ]
  }
}
</script>
