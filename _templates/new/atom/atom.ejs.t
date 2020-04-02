---
to: "src/components/atoms/<%= h.inflection.dasherize(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= h.changeCase.pascal(name) %>.vue"
---
<%
 Label = name.toUpperCase()
%>
<%
if (blocks.indexOf('template') !== -1) {
%><template>
  <div>
  <h1>Hello <%= Label %></h1>
  </div>
</template>
<%
}

if (blocks.indexOf('script') !== -1) {
%><script>
export default {
  name: '<%= h.changeCase.pascal(name) %>',
  data () {
    return {}
  }
}
</script>
<%
}

if (blocks.indexOf('style') !== -1) {
%>
<style lang="postcss" scoped></style><%
}
%>
