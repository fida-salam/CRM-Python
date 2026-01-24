class CompanyFilterMiddleware:
    """
    Middleware to automatically filter queryset by user's company
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Add user's company to request object
        if request.user.is_authenticated:
            try:
                request.user_company = request.user.profile.company
            except:
                request.user_company = None
        else:
            request.user_company = None
        
        response = self.get_response(request)
        return response