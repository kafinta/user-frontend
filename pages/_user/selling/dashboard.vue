<template>
  <LayoutsSellerDashboard page_title="Seller Dashboard">
    <div class="block lg:flex gap-8">
      <div class="w-full lg:w-2/5 grid gap-5">
        <div class="border border-accent-100 p-6">
          <div class="flex items-center gap-5 mb-4">
            <div class="relative flex w-fit">
              <UserProfilePicture :username="user_info.username" :custom_dimensions="true" class="h-10 w-10"/>
              <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="true" :is_displayed="true"/>
            </div>

            <div>
              <UiTypographyP class="text-secondary">{{ user_info.username }}</UiTypographyP>
            </div>
          </div>
          <div class="border-t border-accent-100 grid grid-cols-1 gap-2 py-4">
            <div class="flex items-center justify-between">
              <UiTypographyP>Response rate</UiTypographyP>
              <UiTypographyP :small_text="true">50%</UiTypographyP>
            </div>
            <div class="flex items-center justify-between">
              <UiTypographyP>Response time</UiTypographyP>
              <UiTypographyP :small_text="true">1 Hour</UiTypographyP>
            </div>
            <div class="flex items-center justify-between">
              <UiTypographyP>Delivered on time</UiTypographyP>
              <UiTypographyP :small_text="true">100%</UiTypographyP>
            </div>
            <div class="flex items-center justify-between">
              <UiTypographyP>Order completion</UiTypographyP>
              <UiTypographyP :small_text="true">100%</UiTypographyP>
            </div>
          </div>
          <div class="border-t border-accent-100 flex items-center justify-between pt-4">
            <UiTypographyP>Earned in {{ date.toLocaleString('default', {month: 'long'}) }}</UiTypographyP>
            <UiTypographyP class="font-medium">$0.00</UiTypographyP>
          </div>
        </div>

        <div class="border border-accent-100 p-6 duration-150 ease-in-out">
          <div class="flex justify-between items-center">
            <UiTypographyH3>Inbox</UiTypographyH3>
            <UiButtonsSecondary @clicked="$route.push({path: '/users/inbox'})">View All</UiButtonsSecondary>
          </div>
          <div class="bg-accent-50 h-64 mt-3 duration-150 ease-in-out"></div>
        </div>
      </div>

      <div class="w-full lg:w-3/5 mt-8 lg:mt-0">
        <div class="flex gap-2">
          <div v-for="tab in tabs" :key="tab.id">
            <UiButtonsTab>{{tab.title}}</UiButtonsTab>
          </div>
        </div>
        <div class="mt-8 grid gap-4">
          <div class="border border-accent-100 py-2 px-4 w-full flex justify-between items-center" v-for="item in 5">
            <div class="flex items-center gap-5">
              <div class="relative flex w-fit">
                <UserProfilePicture :username="user_info.username" :custom_dimensions="true" class="h-10 w-10"/>
                <UserProfileOnlineStatus class="absolute right-0 bottom-0" :is_online="false" :is_displayed="true"/>
              </div>

              <div>
                <UiTypographyP class="text-secondary">{{ user_info.username }}</UiTypographyP>
              </div>
            </div>

            <div class="flex gap-5 items-center">
              <div>
                <UiTypographyP :small_text="true">Price</UiTypographyP>
                <UiTypographyP>$100</UiTypographyP>
              </div>
              <div>
                <UiTypographyP :small_text="true">Status</UiTypographyP>
                <UiTypographyP>In Progress</UiTypographyP>
              </div>
            </div>

            <UiButtonsTertiary>View</UiButtonsTertiary>

          </div>
        </div>
      </div>
    </div>
  </LayoutsSellerDashboard>

</template>

<script>
export default {
  middleware: ['user_auth'],
  data() {
    return {
      username: 'Quadri',
      description_edit: false,
      date: '',
      tabs: [
        {
          id: 1,
          title: 'Active Orders',
          count: 0,
          active: true
        },
        {
          id: 2,
          title: 'Completed Orders',
          active: false
        },
        {
          id: 3,
          title: 'Canceled Orders',
          active: false
        },
      ]
    }
  },

  computed: {
    ...mapGetters({
      user_info: "authentication/getUserInfo",
    }),
  },

  methods: {
    ...mapActions({
      getUser: 'authentication/retrieveUserInfo'
    }),
  },

  mounted(){
    setTimeout(() => {
      this.date = new Date()
    }, 2000);
    this.getUser()
    if (process.browser && window.innerWidth <= 320) {
      this.is_small = true
    }
  },
}
</script>

<style>
</style>