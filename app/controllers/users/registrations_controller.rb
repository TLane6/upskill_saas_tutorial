class Users::RegistrationsController < Devise::RegistrationsController
    # Extend default devise gem behaviour so users signing up with a pro account
    # (Plan id 2) save with a special stripe subscription function
    # Otherwise devise signs up user as usual
    def create
        super do |resource|
            if params[:plan]
                resource.plan_id = params[:plan]
                if resource.plan_id == 2
                    resource.save_with_subscription
                else
                    resource.save
                end
            end
        end
    end
end