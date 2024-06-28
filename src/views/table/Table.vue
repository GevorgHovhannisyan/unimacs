<template>
  <vs-table  
noDataText="No data available" ref="table" search :data="[]">
    <div slot="header" class="flex flex-wrap-reverse items-center"></div>

    <template slot="thead"> </template>

    <template>
      <tbody></tbody>
    </template>
  </vs-table>
</template>