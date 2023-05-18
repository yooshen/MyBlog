<template>
    <div class="loading">
        <span></span>
    </div>
</template>

<script>
export default {
    name: 'FireBlogsYouTubeMasterLoading',

    data() {
        return {
            
        };
    },

    mounted() {
        
    },

    methods: {
        
    },
};
</script>

<style lang="scss" scoped>
    .loading{
        background-color: rgba(0,0,0,0.5);
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 101;
        display: flex;
        justify-content: center;
        align-items: center;
        @keyframes spin {
            to{
                transform: rotateZ(360deg);
            }
        }

        span{
            display: block;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            border: 3px solid transparent;
            border-top-color: #fff;
            border-bottom-color: #fff;
            border-radius: 50%;
            animation: spin ease 1000ms infinite;

        }
    }
</style>