const scrollToTop = () => {
    const duration = 800; // Thời gian cuộn (0.8 giây)
    const start = window.scrollY; // Vị trí hiện tại của trang
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime; // Thời gian đã trôi qua
        const progress = Math.min(elapsed / duration, 1); // Tỷ lệ hoàn thành (từ 0 đến 1)
        const scrollPosition = start * (1 - progress); // Vị trí cuộn hiện tại
        window.scrollTo(0, scrollPosition);

        if (progress < 1) {
            requestAnimationFrame(animateScroll); // Tiếp tục cuộn nếu chưa hoàn thành
        }
    };

    requestAnimationFrame(animateScroll);
};

export default scrollToTop;